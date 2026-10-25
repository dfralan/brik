import { readFile, writeFile, mkdir, copyFile, cp, readdir, unlink } from "node:fs/promises";
import { createHash } from "node:crypto";
import { gzipSync } from "node:zlib";
import { minify } from "terser";

const source = await readFile("brik.js", "utf8");
const minified = await minify(source, {
  compress: true,
  mangle: true,
  module: false,
  format: { comments: false }
});

if (!minified.code) throw new Error("minify failed");

const themeSource = await readFile("theme/brik-theme.css", "utf8");
const themeMin = themeSource
  .replace(/\/\*[\s\S]*?\*\//g, "")
  .replace(/\n{3,}/g, "\n\n")
  .trim() + "\n";

function sri(buf) {
  return "sha384-" + createHash("sha384").update(buf).digest("base64");
}

function report(label, raw, min) {
  const gzip = gzipSync(min).length;
  console.log(label);
  console.log("  source   " + raw + " B");
  console.log("  minified " + min.length + " B");
  console.log("  gzip     " + gzip + " B");
  return gzip;
}

const integrity = {
  "brik.min.js": sri(minified.code),
  "brik-theme.min.css": sri(themeMin)
};

const bricks = [
  ["accordion", "Accordion"],
  ["alert", "Alert"],
  ["avatar", "Avatar"],
  ["badge", "Badge"],
  ["button", "Button"],
  ["card", "Card"],
  ["checkbox", "Checkbox"],
  ["dialog", "Dialog"],
  ["field", "Field"],
  ["layout", "Layout"],
  ["progress", "Progress"],
  ["radio", "Radio"],
  ["separator", "Separator"],
  ["slider", "Slider"],
  ["switch", "Switch"],
  ["table", "Table"],
  ["tabs", "Tabs"],
  ["toggle", "Toggle"],
  ["tooltip", "Tooltip"],
  ["type", "Type"]
];

async function emit(dir) {
  const prefix = dir === "." ? "" : dir + "/";
  await mkdir(prefix + "v1", { recursive: true });
  await writeFile(prefix + "brik.min.js", minified.code);
  await writeFile(prefix + "v1/brik.min.js", minified.code);
  await writeFile(prefix + "brik-theme.min.css", themeMin);
  await writeFile(prefix + "v1/brik-theme.min.css", themeMin);
  await writeFile(prefix + "v1/integrity.json", JSON.stringify(integrity, null, 2) + "\n");
  await copyFile("site/index.html", prefix + "index.html");
  await copyFile("site/style.css", prefix + "style.css");
  await copyFile("site/app.js", prefix + "app.js");
  await copyFile("site/_headers", prefix + "_headers");
  await copyFile("brik.svg", prefix + "brik.svg");
  await cp("site/examples", prefix + "examples", { recursive: true });
  await cp("site/theme", prefix + "theme", { recursive: true });
  await mkdir(prefix + "theme/components", { recursive: true });
  const shell = await readFile("site/theme/index.html", "utf8");
  const keep = new Set(["index.html"]);
  for (const [id, title] of bricks) {
    keep.add(id + ".html");
    const html = shell
      .replace('data-brick="index"', 'data-brick="' + id + '"')
      .replace("<title>Brik · Theme</title>", "<title>Brik · " + title + "</title>")
      .replace(
        "A CSS component library. Tokens, roles, and native elements.",
        title + " brick in brik-theme."
      );
    await writeFile(prefix + "theme/components/" + id + ".html", html);
  }
  for (const name of await readdir(prefix + "theme/components")) {
    if (name.endsWith(".html") && !keep.has(name)) {
      await unlink(prefix + "theme/components/" + name);
    }
  }
  await mkdir(prefix + "docs", { recursive: true });
  await copyFile("docs/modules.md", prefix + "docs/modules.md");
}

await emit("dist");
await emit(".");

const jsGzip = report("Brik size", Buffer.byteLength(source), minified.code);
report("brik-theme size", Buffer.byteLength(themeSource), themeMin);
if (jsGzip >= 3072) console.log("  warning  core gzip is over the 3 KB target");
