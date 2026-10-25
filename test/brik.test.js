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
  window.eval(readFileSync(new URL("../site/examples/pomodoro.js", import.meta.url), "utf8"));
  window.eval(readFileSync(new URL("../site/examples/tasks.js", import.meta.url), "utf8"));
  window.eval(readFileSync(new URL("../site/app.js", import.meta.url), "utf8"));
  Brik.mount();
  assert.match(document.querySelector("h1").textContent, /Just enough/);
  assert.match(document.body.textContent, /Brik.component/);
  assert.match(document.querySelector(".agent").textContent, /Copy for agents/);
  assert.ok(document.querySelector(".agent.brik-button.primary"));
  assert.ok(document.querySelector("#why .brik-card"));
  assert.ok(document.querySelector("#examples .brik-button.primary"));
  assert.ok(document.querySelector("#examples .brik-button.secondary"));
  assert.match(document.querySelector("#ecosystem").textContent, /brik-theme/);
  assert.match(document.querySelector("#ecosystem").textContent, /Proposed/);
  assert.match(document.body.textContent, /brik-theme.min.css/);
  assert.equal(document.querySelector(".mod-source[href='/theme/components']").textContent, "Components");
  assert.match(document.querySelector("[data-open-widget]").textContent, /Open widget/);
  assert.equal(document.querySelector(".demo-code").hidden, true);
  document.querySelector("[data-see-code]").click();
  await tick();
  assert.equal(document.querySelector(".demo-code").hidden, false);
  assert.match(document.querySelector("[data-see-code]").textContent, /Hide code/);
  assert.match(document.querySelector(".demo-code").textContent, /Brik.component\("pomodoro"/);
  assert.match(document.querySelector(".demo-code").textContent, /🍅/);
  document.querySelector("[data-see-code]").click();
  await tick();
  assert.equal(document.querySelector(".demo-code").hidden, true);
  assert.match(document.querySelector("[data-see-code]").textContent, /See code/);
  document.querySelector("[data-open-widget]").click();
  await tick();
  assert.ok(document.querySelector(".pomo-layer"));
  assert.match(document.querySelector(".pomo-time").textContent, /25:00/);
  assert.match(document.querySelector(".pomo h1").textContent, /🍅 Pomodoro/);
  document.querySelector(".pomo-x").click();
  await tick();
  assert.equal(document.querySelector(".pomo-layer"), null);
  document.querySelector("[data-see-tasks]").click();
  await tick();
  assert.match(document.body.textContent, /Brik.component\("tasks"/);
  document.querySelector("[data-open-tasks]").click();
  await tick();
  assert.ok(document.querySelector(".tasks-layer"));
  var input = document.querySelector(".tasks input");
  input.value = "escribir";
  input.dispatchEvent(new window.Event("input", { bubbles: true }));
  document.querySelector(".tasks .brik-button.primary").click();
  await tick();
  assert.match(document.querySelector(".tasks-list").textContent, /escribir/);
  document.querySelector(".tasks-x").click();
  await tick();
  assert.equal(document.querySelector(".tasks-layer"), null);
  assert.equal(document.querySelectorAll("[data-brik]").length > 5, true);
  document.querySelector(".live button").click();
  await tick();
  assert.equal(document.querySelector(".live strong").textContent, "1");
});

test("theme docs present the button bricks", async function () {
  await load("<!doctype html><html data-brick='button'><body><brik theme-docs></brik></body></html>");
  window.eval(readFileSync(new URL("../site/theme/docs.js", import.meta.url), "utf8"));
  Brik.mount();
  assert.match(document.body.textContent, /brik-button/);
  assert.ok(document.querySelector(".brik-button.tint"));
  assert.ok(document.querySelector(".brik-button.ghost"));
});

test("theme component catalog lists accordion", async function () {
  await load("<!doctype html><html data-brick='components'><body><brik theme-docs></brik></body></html>");
  window.eval(readFileSync(new URL("../site/theme/docs.js", import.meta.url), "utf8"));
  Brik.mount();
  assert.match(document.body.textContent, /Accordion/);
  assert.match(document.body.textContent, /Dialog/);
  assert.ok(document.querySelector("a[href='/theme/components/accordion']"));
});

test("theme accordion docs include overview and api", async function () {
  await load("<!doctype html><html data-brick='accordion'><body><brik theme-docs></brik></body></html>");
  window.eval(readFileSync(new URL("../site/theme/docs.js", import.meta.url), "utf8"));
  Brik.mount();
  assert.match(document.body.textContent, /Overview/);
  assert.match(document.body.textContent, /Quick Start/);
  assert.match(document.body.textContent, /API Reference/);
  assert.ok(document.querySelector(".brik-accordion"));
  assert.ok(document.querySelector("details.brik-item"));
  var tabs = [...document.querySelector("[role=tablist]").children];
  assert.ok(tabs.length > 0);
  tabs.forEach(function (el) {
    assert.equal(el.getAttribute("role"), "tab");
  });
});

test("theme home presents the library landing", async function () {
  await load("<!doctype html><html data-brick='index'><body><brik theme-docs></brik></body></html>");
  window.eval(readFileSync(new URL("../site/theme/docs.js", import.meta.url), "utf8"));
  Brik.mount();
  assert.match(document.body.textContent, /The bricks/);
  assert.match(document.body.textContent, /Browse the catalog/);
  assert.ok(document.querySelector(".hero"));
  assert.ok(document.querySelector(".command"));
  assert.ok(document.querySelector(".brand img"));
  assert.ok(document.querySelector(".foot .made"));
  assert.ok(document.querySelector(".docs-stage"));
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

test("nested effects restore the outer tracker", async function () {
  await load();
  var outer = Brik.state(0);
  var inner = Brik.state(0);
  var seen = [];
  Brik.effect(function () {
    Brik.effect(function () {
      inner.value;
    });
    seen.push(outer.value);
  });
  assert.deepEqual(seen, [0]);
  outer.value = 1;
  await tick();
  assert.deepEqual(seen, [0, 1]);
});

test("disposed effects do not run after unmount or while queued", async function () {
  await load("<!doctype html><html><body><brik app></brik></body></html>");
  var n = Brik.state(0);
  var runs = 0;
  Brik.component("app", function () {
    Brik.effect(function () {
      n.value;
      runs++;
    });
    return "live";
  });
  for (var i = 0; i < 4; i++) {
    document.body.innerHTML = "<brik app></brik>";
    var stop = Brik.mount();
    stop();
  }
  var after = runs;
  n.value = 1;
  await tick();
  assert.equal(runs, after);

  var queued = 0;
  var halt = Brik.effect(function () {
    n.value;
    queued++;
  });
  n.value = 2;
  halt();
  await tick();
  assert.equal(queued, 1);
});

test("a throwing effect does not drop the rest of the batch", async function () {
  await load();
  var errors = [];
  var original = window.console.error;
  window.console.error = function (err) { errors.push(err); };
  var boom = Brik.state(0);
  var other = Brik.state(0);
  var good = 0;
  Brik.effect(function () {
    if (boom.value) throw new Error("boom");
    boom.value;
  });
  Brik.effect(function () {
    other.value;
    if (other.value) good++;
  });
  boom.value = 1;
  other.value = 1;
  await tick();
  window.console.error = original;
  assert.equal(good, 1);
  assert.equal(errors.length >= 1, true);
});

test("async components that resolve after unmount do not write", async function () {
  await load("<!doctype html><html><body><brik app></brik></body></html>");
  var resolve;
  Brik.component("app", function () {
    return new Promise(function (done) { resolve = done; });
  });
  var unmount = Brik.mount();
  unmount();
  resolve(Brik.h("p", { id: "late" }, "nope"));
  await tick();
  assert.equal(document.querySelector("#late"), null);
});

test("state is shallow and uses Object.is", async function () {
  await load();
  var user = Brik.state(window.eval("({ nested: { age: 1 } })"));
  var seen = 0;
  Brik.effect(function () {
    user.nested;
    seen++;
  });
  user.nested.age = 2;
  await tick();
  assert.equal(seen, 1);
  user.nested = { age: 3 };
  await tick();
  assert.equal(seen, 2);

  var n = Brik.state(NaN);
  var nanSeen = 0;
  Brik.effect(function () {
    n.value;
    nanSeen++;
  });
  n.value = NaN;
  await tick();
  assert.equal(nanSeen, 1);
});

test("h() refuses string event handlers and accepts unsafeHTML", async function () {
  await load();
  var el = Brik.h("a", { onclick: "alert(1)", href: "https://example.com" });
  assert.equal(el.getAttribute("onclick"), null);
  assert.equal(el.getAttribute("href"), "https://example.com");
  var trusted = Brik.h("div", { html: "<em id='via-html'>ok</em>" });
  assert.equal(trusted.querySelector("#via-html").textContent, "ok");
  var also = Brik.h("div", { unsafeHTML: "<strong id='via-unsafe'>ok</strong>" });
  assert.equal(also.querySelector("#via-unsafe").textContent, "ok");
});

test("last component registration wins and fragments mount once", async function () {
  await load("<!doctype html><html><body><brik app></brik></body></html>");
  var childRuns = 0;
  Brik.component("app", function () { return "first"; });
  Brik.component("app", function () {
    var frag = document.createDocumentFragment();
    frag.appendChild(Brik.h("p", { id: "frag" }, "second"));
    frag.appendChild(Brik.h("brik", { child: true }));
    return frag;
  });
  Brik.component("child", function () {
    childRuns++;
    return Brik.h("span", { id: "kid" }, "kid");
  });
  Brik.mount();
  assert.equal(document.getElementById("frag").textContent, "second");
  assert.equal(document.getElementById("kid").textContent, "kid");
  assert.equal(childRuns, 1);
  assert.equal(document.querySelectorAll("[data-brik='child']").length, 1);
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
