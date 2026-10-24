(function () {
  var h = Brik.h;
  var CDN = '<script defer src="https://brikjs.pages.dev/v1/brik.min.js"></script>';
  var AGENT = [
    "Build this UI with Brik. Brik is a tiny client-side reactive runtime: https://brikjs.pages.dev",
    "",
    "Brik is not React, Vue, Next, or Astro. One file. Zero dependencies. No npm. No compiler. No virtual DOM. No server. The interface exists only in the browser. That is the point. If the UI needs a backend to appear, it is not Brik.",
    "",
    "Load it:",
    CDN,
    "<body><brik app></brik></body>",
    "",
    "Public API — five primitives:",
    "Brik.component(name, fn)  register a component. Name must match /^[a-z][a-z0-9-]*$/.",
    "Brik.mount(node?)         mount <brik> elements. Returns unmount().",
    "Brik.h(tag, props, ...children)  create DOM. String children are text nodes. Function children are reactive text.",
    "Brik.state(value)         reactive Proxy. Primitives are boxed as { value }.",
    "Brik.effect(fn)           reruns when a value it read changes. May return a cleanup.",
    "",
    "Rules:",
    "- Nested <brik name></brik> elements mount recursively after the parent renders.",
    "- HTML strings returned by a component are trusted.",
    "- Untrusted or remote text goes through Brik.h() as children. Never assign it to innerHTML.",
    "- Never evaluate JavaScript supplied by an agent or a network. Never hide secrets in the client.",
    "- Do not add a router, JSX, a bundler, or another framework unless the user asks.",
    "- Keep the implementation small. Be brave. Ship the interface where the user already is.",
    "",
    "Build what the user asked for using only Brik."
  ].join("\n");

  function copyText(text, flag) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        flag.value = true;
        setTimeout(function () { flag.value = false; }, 1400);
      });
    }
  }

  function logo(size) {
    return h("img", {
      src: "./brik.svg",
      width: String(size),
      height: String(size),
      alt: "Brik"
    });
  }

  function currentTheme() {
    return document.documentElement.getAttribute("data-theme") || "light";
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    try { localStorage.setItem("theme", theme); } catch (err) {}
  }

  function preferredTheme() {
    try {
      var stored = localStorage.getItem("theme");
      if (stored === "light" || stored === "dark") return stored;
    } catch (err) {}
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  applyTheme(preferredTheme());

  Brik.component("app", function () {
    return h("div", { class: "page" },
      h("brik", { nav: true }),
      h("brik", { hero: true }),
      h("brik", { examples: true }),
      h("brik", { docs: true }),
      h("brik", { foot: true })
    );
  });

  Brik.component("nav", function () {
    return h("header", { class: "nav" },
      h("a", { class: "brand", href: "/" }, logo(22), "Brik"),
      h("div", { class: "nav-links" },
        h("a", { href: "#examples" }, "Examples"),
        h("a", { href: "#use" }, "Use"),
        h("a", { href: "https://github.com/dfralan/brik" }, "GitHub"),
        h("brik", { theme: true })
      )
    );
  });

  Brik.component("theme", function () {
    var theme = Brik.state(currentTheme());
    var sun = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M5 12H3M21 12h-2M6.2 6.2l1.4 1.4M16.4 16.4l1.4 1.4M6.2 17.8l1.4-1.4M16.4 7.6l1.4-1.4"/></svg>';
    var moon = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M15.2 3.1a8.8 8.8 0 1 0 5.7 15.6A8.2 8.2 0 0 1 15.2 3.1z"/></svg>';
    return h("button", {
      class: "theme",
      type: "button",
      "aria-label": "Toggle theme",
      ref: function (el) {
        Brik.effect(function () {
          el.innerHTML = theme.value === "dark" ? sun : moon;
        });
      },
      onclick: function () {
        var next = theme.value === "dark" ? "light" : "dark";
        applyTheme(next);
        theme.value = next;
      }
    });
  });

  Brik.component("hero", function () {
    var copied = Brik.state(false);
    var agent = Brik.state(false);
    return h("section", { class: "hero" },
      logo(48),
      h("h1", null, "Just enough", h("br"), "to exist."),
      h("p", { class: "lede" }, "The interface lives in the browser. No server to ask permission."),
      h("div", { class: "command" },
        h("code", null, CDN),
        h("button", {
          class: "copy",
          type: "button",
          onclick: function () { copyText(CDN, copied); }
        }, function () {
          return copied.value ? "Copied" : "Copy";
        })
      ),
      h("button", {
        class: "agent",
        type: "button",
        onclick: function () { copyText(AGENT, agent); }
      }, function () {
        return agent.value ? "Copied for agents" : "Copy for agents";
      }),
      h("p", { class: "hint" }, "Be brave. Not for everyone. 1.8 KB, client-side, zero dependencies.")
    );
  });

  Brik.component("examples", function () {
    return h("section", { class: "section", id: "examples" },
      h("div", { class: "section-head" },
        h("h2", null, "It already exists"),
        h("p", null, "If it needs a backend to say hello, it is not Brik.")
      ),
      h("div", { class: "grid" },
        h("brik", { live: true }),
        h("brik", { nest: true })
      )
    );
  });

  Brik.component("live", function () {
    var n = Brik.state(0);
    return h("article", { class: "card" },
      h("h3", null, "State"),
      h("p", null, "The client is the source of truth. Change happens in the open."),
      h("div", { class: "live" },
        h("strong", null, function () { return n.value; }),
        h("button", {
          type: "button",
          onclick: function () { n.value++; }
        }, "Add one")
      )
    );
  });

  Brik.component("nest", function (ctx) {
    var extra = Brik.state(0);
    return h("article", { class: "card" },
      h("h3", null, "Nested"),
      h("p", null, "An agent can grow a UI the same way a person does: one brick at a time."),
      h("div", { class: "tree" },
        h("div", { class: "row" }, h("span", { class: "mark" }, "app"), "this page"),
        h("brik", { branch: true }),
        h("button", {
          type: "button",
          onclick: function () {
            extra.value++;
            var node = document.createElement("brik");
            node.setAttribute("leaf", "");
            node.setAttribute("label", "dynamic " + extra.value);
            ctx.el.querySelector(".tree").appendChild(node);
            Brik.mount(node);
          }
        }, "Mount another")
      )
    );
  });

  Brik.component("branch", function () {
    return h("div", null,
      h("div", { class: "row" }, h("span", { class: "mark" }, "branch"), "mounted by nest"),
      h("brik", { leaf: true, label: "mounted by branch" })
    );
  });

  Brik.component("leaf", function (ctx) {
    return h("div", { class: "row" },
      h("span", { class: "mark" }, "leaf"),
      ctx.el.getAttribute("label") || "leaf"
    );
  });

  Brik.component("docs", function () {
    var sections = [
      {
        title: "Install",
        body: "One file. The page is the app. Nothing to compile, nothing waiting on a server.",
        code: "<body>\n  <brik app></brik>\n  <script defer src=\"./brik.min.js\"></script>\n  <script defer src=\"./app.js\"></script>\n</body>"
      },
      {
        title: "Define",
        body: "Name it. Mount it. A component is just a function that can exist.",
        code: "Brik.component(\"app\", function () {\n  return Brik.h(\"main\", null, \"hello\");\n});"
      },
      {
        title: "Nest",
        body: "Interfaces that build themselves. Descendants wake up on their own.",
        code: "Brik.component(\"app\", function () {\n  return \"<main><brik header></brik></main>\";\n});"
      },
      {
        title: "State",
        body: "The user sees the same memory you write to. No round trip to feel alive.",
        code: "var n = Brik.state(0);\nBrik.effect(function () {\n  label.textContent = n.value;\n});\nn.value++;"
      },
      {
        title: "Lifecycle",
        body: "What you mount, you can take apart. No ghosts left in the page.",
        code: "var stop = Brik.mount();\nstop();"
      },
      {
        title: "Dynamic",
        body: "Don't wait for the first paint to be the last shape.",
        code: "var node = document.createElement(\"brik\");\nnode.setAttribute(\"panel\", \"\");\nhost.appendChild(node);\nBrik.mount(node);"
      },
      {
        title: "Untrusted data",
        body: "The client is public. That is why Brik stays here. Foreign text stays text.",
        code: "Brik.h(\"p\", null, remoteText);"
      }
    ];

    return h("section", { class: "section", id: "use" },
      h("div", { class: "section-head" },
        h("h2", null, "Stay on the client"),
        h("p", null, "Five primitives. The rest is the browser you already trust.")
      ),
      sections.map(function (item) {
        return h("article", { class: "doc" },
          h("div", null,
            h("h3", null, item.title),
            h("p", null, item.body)
          ),
          h("pre", null, item.code)
        );
      })
    );
  });

  Brik.component("foot", function () {
    return h("footer", { class: "foot" },
      h("span", null, "Brik stays on the client. That is the point."),
      h("a", { href: "https://github.com/dfralan/brik" }, "github.com/dfralan/brik")
    );
  });
})();
