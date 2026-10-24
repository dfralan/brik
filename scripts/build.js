import { readFile, writeFile, mkdir, copyFile } from "node:fs/promises";
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

async function emit(dir) {
  const prefix = dir === "." ? "" : dir + "/";
  await mkdir(prefix + "v1", { recursive: true });
  await writeFile(prefix + "brik.min.js", minified.code);
  await writeFile(prefix + "v1/brik.min.js", minified.code);
  await copyFile("site/index.html", prefix + "index.html");
  await copyFile("site/style.css", prefix + "style.css");
  await copyFile("site/app.js", prefix + "app.js");
  await copyFile("site/_headers", prefix + "_headers");
  await copyFile("brik.svg", prefix + "brik.svg");
}

await emit("dist");
await emit(".");

const raw = Buffer.byteLength(source);
const min = Buffer.byteLength(minified.code);
const gzip = gzipSync(minified.code).length;

console.log("Brik size");
console.log("  source   " + raw + " B");
console.log("  minified " + min + " B");
console.log("  gzip     " + gzip + " B");
if (gzip >= 3072) console.log("  warning  gzip is over the 3 KB target");
