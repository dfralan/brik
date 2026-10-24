import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { Window } from "happy-dom";

const source = readFileSync(new URL("../brik.js", import.meta.url), "utf8");

let window;
let document;
let Brik;

async function load(html, code) {
  window = new Window({ url: "https://brik.test/" });
  document = window.document;
  document.write(html || "<!doctype html><html><body></body></html>");
  globalThis.window = window;
  globalThis.document = document;
  globalThis.HTMLElement = window.HTMLElement;
  globalThis.Node = window.Node;
  globalThis.Promise = Promise;
  window.eval(code || source);
  Brik = window.Brik;
  await tick();
  return { window, document, Brik };
}

function tick() {
  return new Promise(function (resolve) {
    setTimeout(resolve, 0);
  });
}

beforeEach(function () {
  if (window) window.close();
});

test("exposes the public API on a standalone script", async function () {
  await load();
  assert.equal(typeof Brik.component, "function");
  assert.equal(typeof Brik.mount, "function");
  assert.equal(typeof Brik.h, "function");
  assert.equal(typeof Brik.state, "function");
  assert.equal(typeof Brik.effect, "function");
});

test("mounts <brik app> on boot", async function () {
  await load("<!doctype html><html><body><brik app></brik></body></html>");
  Brik.component("app", function () {
    return "<p>hello</p>";
  });
  Brik.mount();
  assert.equal(document.querySelector("p").textContent, "hello");
  assert.equal(document.querySelector("brik").getAttribute("data-brik"), "app");
});

test("mounts nested components at several levels", async function () {
  await load("<!doctype html><html><body><brik app></brik></body></html>");
  Brik.component("app", function () {
    return "<main><brik header></brik><brik workspace></brik></main>";
  });
  Brik.component("header", function () {
    return "<h1>Brik</h1>";
  });
  Brik.component("workspace", function () {
    return "<section><brik panel></brik></section>";
  });
  Brik.component("panel", function () {
    return "<p>nested</p>";
  });
  Brik.mount();
  assert.equal(document.querySelector("h1").textContent, "Brik");
  assert.equal(document.querySelector("p").textContent, "nested");
  assert.equal(document.querySelectorAll("brik").length, 4);
});

test("mounts components added after the first load", async function () {
  await load("<!doctype html><html><body><div id='host'></div></body></html>");
  Brik.component("later", function () {
    return "<em>dynamic</em>";
  });
  var node = document.createElement("brik");
  node.setAttribute("later", "");
  document.getElementById("host").appendChild(node);
  Brik.mount(node);
  assert.equal(document.querySelector("em").textContent, "dynamic");
});

test("keeps independent instances isolated", async function () {
  await load("<!doctype html><html><body><brik counter></brik><brik counter></brik></body></html>");
  Brik.component("counter", function () {
    var n = Brik.state(0);
    return Brik.h(
      "button",
      {
        onclick: function () {
          n.value++;
        }
      },
      function () {
        return n.value;
      }
    );
  });
  Brik.mount();
  var buttons = document.querySelectorAll("button");
  assert.equal(buttons.length, 2);
  buttons[0].click();
  await tick();
  assert.equal(buttons[0].textContent, "1");
  assert.equal(buttons[1].textContent, "0");
});

test("updates reactive state without rebuilding the tree", async function () {
  await load("<!doctype html><html><body><brik app></brik></body></html>");
  var host;
  Brik.component("app", function () {
    var n = Brik.state(0);
    var label = Brik.h("span", { id: "n" }, function () {
      return n.value;
    });
    return Brik.h("div", { id: "wrap", ref: function (el) { host = el; } },
      label,
      Brik.h("button", {
        id: "inc",
        onclick: function () {
          n.value++;
        }
      }, "+")
    );
  });
  Brik.mount();
  var wrap = document.getElementById("wrap");
  var label = document.getElementById("n");
  document.getElementById("inc").click();
  document.getElementById("inc").click();
  await tick();
  assert.equal(document.getElementById("n").textContent, "2");
  assert.equal(document.getElementById("wrap"), wrap);
  assert.equal(document.getElementById("n"), label);
  assert.equal(host, wrap);
});

test("repeated state writes settle on the last value", async function () {
  await load();
  var n = Brik.state(0);
  var seen = [];
  Brik.effect(function () {
    seen.push(n.value);
  });
  for (var i = 0; i < 20; i++) n.value = i + 1;
  await tick();
  assert.equal(n.value, 20);
  assert.equal(seen[seen.length - 1], 20);
});

test("unmount disposes instances and effect cleanups", async function () {
  await load("<!doctype html><html><body><brik app></brik></body></html>");
  var cleaned = 0;
  var n = Brik.state(0);
  Brik.component("app", function () {
    Brik.effect(function () {
      n.value;
      return function () {
        cleaned++;
      };
    });
    return "<p>live</p>";
  });
  var unmount = Brik.mount();
  assert.equal(document.querySelector("p").textContent, "live");
  n.value = 1;
  await tick();
  unmount();
  assert.equal(document.querySelector("p"), null);
  var after = cleaned;
  n.value = 2;
  await tick();
  assert.ok(cleaned >= 1);
  assert.equal(cleaned, after);
});

test("rejects malformed component names and bodies", async function () {
  await load();
  assert.throws(function () {
    Brik.component("__proto__", function () {});
  });
  assert.throws(function () {
    Brik.component("constructor", function () {});
  });
  assert.throws(function () {
    Brik.component("App", function () {});
  });
  assert.throws(function () {
    Brik.component("app", null);
  });
  Brik.component("app", function () {
    return "ok";
  });
  assert.equal(typeof Brik.component, "function");
});

test("inserts untrusted strings as text, not HTML", async function () {
  await load("<!doctype html><html><body><brik app></brik></body></html>");
  Brik.component("app", function () {
    return Brik.h("div", { id: "box" }, "<img src=x onerror=top.pwned=1><script>top.pwned=1</script>");
  });
  Brik.mount();
  var box = document.getElementById("box");
  assert.equal(box.children.length, 0);
  assert.match(box.textContent, /<img/);
  assert.equal(window.pwned, undefined);
});

test("does not evaluate missing or unknown components", async function () {
  await load("<!doctype html><html><body><brik missing></brik><brik app></brik></body></html>");
  Brik.component("app", function () {
    return "<brik ghost></brik><span>ok</span>";
  });
  Brik.mount();
  assert.equal(document.querySelector("span").textContent, "ok");
  assert.equal(document.querySelector("brik[missing]").textContent, "");
  assert.equal(document.querySelector("brik[ghost]").textContent, "");
  assert.equal(document.querySelector("brik[data-brik='ghost']"), null);
});

test("stops recursive self-mounting before it runs away", async function () {
  await load("<!doctype html><html><body><brik app></brik></body></html>");
  Brik.component("app", function () {
    return "<brik app></brik>";
  });
  assert.throws(function () {
    Brik.mount();
  }, /nesting limit/);
});

test("trusted HTML from a component can nest further briks", async function () {
  await load("<!doctype html><html><body><brik app></brik></body></html>");
  Brik.component("app", function () {
    return "<section><brik child></brik></section>";
  });
  Brik.component("child", function () {
    return Brik.h("strong", null, "inside");
  });
  Brik.mount();
  assert.equal(document.querySelector("strong").textContent, "inside");
});

test("async components mount after they resolve", async function () {
  await load("<!doctype html><html><body><brik app></brik></body></html>");
  Brik.component("app", function () {
    return Promise.resolve("<p>later</p>");
  });
  Brik.mount();
  await tick();
  assert.equal(document.querySelector("p").textContent, "later");
});

test("source and minified runtime contain no eval", function () {
  assert.equal(/\beval\s*\(/.test(source), false);
  const minPath = new URL("../dist/brik.min.js", import.meta.url);
  if (existsSync(minPath)) {
    const min = readFileSync(minPath, "utf8");
    assert.equal(/\beval\s*\(/.test(min), false);
    assert.ok(min.length > 0);
  }
});

test("official website mounts on Brik", async function () {
  await load("<!doctype html><html><body><brik app></brik></body></html>");
  window.eval(readFileSync(new URL("../site/app.js", import.meta.url), "utf8"));
  Brik.mount();
  assert.match(document.querySelector("h1").textContent, /Just enough/);
  assert.match(document.body.textContent, /Brik.component/);
  assert.equal(document.querySelectorAll("[data-brik]").length > 5, true);
  document.querySelector(".live button").click();
  await tick();
  assert.equal(document.querySelector(".live strong").textContent, "1");
});

test("official website runs on the minified file", async function () {
  const minPath = new URL("../dist/brik.min.js", import.meta.url);
  if (!existsSync(minPath)) return;
  await load("<!doctype html><html><body><brik app></brik></body></html>", readFileSync(minPath, "utf8"));
  window.eval(readFileSync(new URL("../site/app.js", import.meta.url), "utf8"));
  Brik.mount();
  assert.match(document.querySelector("h1").textContent, /Just enough/);
  document.querySelector(".tree button").click();
  await tick();
  assert.match(document.body.textContent, /dynamic 1/);
});

test("h() binds events and keeps text children safe", async function () {
  await load("<!doctype html><html><body><brik app></brik></body></html>");
  var clicks = 0;
  Brik.component("app", function () {
    return Brik.h("button", {
      id: "go",
      onclick: function () {
        clicks++;
      }
    }, "<b>nope</b>");
  });
  Brik.mount();
  var button = document.getElementById("go");
  assert.equal(button.children.length, 0);
  assert.equal(button.textContent, "<b>nope</b>");
  button.click();
  assert.equal(clicks, 1);
});
