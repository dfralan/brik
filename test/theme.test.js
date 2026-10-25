import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { Window } from "happy-dom";

const source = readFileSync(new URL("../theme/brik-theme.css", import.meta.url), "utf8");
const built = new URL("../dist/v1/brik-theme.min.css", import.meta.url);

test("theme source defines tokens, schemes, focus and motion", function () {
  assert.match(source, /--brik-bg/);
  assert.match(source, /--brik-fg/);
  assert.match(source, /--brik-accent/);
  assert.match(source, /--brik-tint-rgb/);
  assert.match(source, /--brik-radius/);
  assert.match(source, /dialog\.brik-dialog/);
  assert.match(source, /\.brik-check:checked/);
  assert.match(source, /-webkit-appearance:\s*none/);
  assert.match(source, /-webkit-text-fill-color/);
  assert.match(source, /html\[data-theme="light"\]/);
  assert.match(source, /html\[data-theme="dark"\]/);
  assert.match(source, /:focus-visible/);
  assert.match(source, /prefers-reduced-motion/);
  assert.match(source, /\.brik-button/);
  assert.match(source, /\.brik-button\.primary/);
  assert.match(source, /\.secondary/);
  assert.match(source, /\.tint/);
  assert.match(source, /\.ghost/);
  assert.match(source, /\.brik-field/);
  assert.match(source, /\.brik-card/);
  assert.match(source, /\.brik-accordion/);
  assert.match(source, /\.brik-dialog/);
  assert.match(source, /\.brik-switch/);
});

test("theme tokens switch with data-theme", function () {
  const window = new Window({ url: "https://brik.test/" });
  const document = window.document;
  document.write("<!doctype html><html><head></head><body></body></html>");
  const style = document.createElement("style");
  style.textContent = source;
  document.head.appendChild(style);
  document.documentElement.setAttribute("data-theme", "light");
  assert.match(source, /#fcfefb/);
  document.documentElement.setAttribute("data-theme", "dark");
  assert.match(source, /#02040a/);
  window.close();
});

test("published theme asset stays a standalone stylesheet", function () {
  if (!existsSync(built)) return;
  const css = readFileSync(built, "utf8");
  assert.match(css, /--brik-bg/);
  assert.equal(css.includes("<script"), false);
});
