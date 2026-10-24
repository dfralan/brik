(function () {
  var h = Brik.h;
  var CDN = '<script defer src="https://brikjs.pages.dev/v1/brik.min.js"></script>';

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
    return h("section", { class: "hero" },
      logo(48),
      h("h1", null, "Just enough", h("br"), "to exist."),
      h("p", { class: "lede" }, "A tiny reactive runtime for interfaces that build themselves."),
      h("div", { class: "command" },
        h("code", null, CDN),
        h("button", {
          class: "copy",
          type: "button",
          onclick: function () {
            if (navigator.clipboard && navigator.clipboard.writeText) {
              navigator.clipboard.writeText(CDN).then(function () {
                copied.value = true;
                setTimeout(function () { copied.value = false; }, 1400);
              });
            }
          }
        }, function () {
          return copied.value ? "Copied" : "Copy";
        })
      ),
      h("p", { class: "hint" }, "1.8 KB gzip. Zero dependencies. No npm.")
    );
  });

  Brik.component("examples", function () {
    return h("section", { class: "section", id: "examples" },
      h("div", { class: "section-head" },
        h("h2", null, "See it running"),
        h("p", null, "These are live Brik components, not mocks.")
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
      h("p", null, "A counter that updates one text node."),
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
      h("p", null, "Components that mount other components."),
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
        body: "One file. No npm. No build. Put a root component in the document and load Brik.",
        code: "<body>\n  <brik app></brik>\n  <script defer src=\"./brik.min.js\"></script>\n  <script defer src=\"./app.js\"></script>\n</body>"
      },
      {
        title: "Define",
        body: "Register a component by name. It may return trusted HTML, a node, or a fragment.",
        code: "Brik.component(\"app\", function () {\n  return Brik.h(\"main\", null, \"hello\");\n});"
      },
      {
        title: "Nest",
        body: "Generated <brik> descendants mount on their own. Parent identity stays internal.",
        code: "Brik.component(\"app\", function () {\n  return \"<main><brik header></brik></main>\";\n});"
      },
      {
        title: "State",
        body: "Proxy state. Effects rerun only when a value they read changes. Nodes stay in place.",
        code: "var n = Brik.state(0);\nBrik.effect(function () {\n  label.textContent = n.value;\n});\nn.value++;"
      },
      {
        title: "Lifecycle",
        body: "Each instance has its own id. Effects return a cleanup. Unmount disposes the tree.",
        code: "var stop = Brik.mount();\nstop();"
      },
      {
        title: "Dynamic",
        body: "Create a <brik> later and mount it. Useful for interfaces that grow over time.",
        code: "var node = document.createElement(\"brik\");\nnode.setAttribute(\"panel\", \"\");\nhost.appendChild(node);\nBrik.mount(node);"
      },
      {
        title: "Untrusted data",
        body: "HTML strings are trusted. Put foreign text through Brik.h so it becomes a text node. Never evaluate agent-supplied JavaScript.",
        code: "Brik.h(\"p\", null, remoteText);"
      }
    ];

    return h("section", { class: "section", id: "use" },
      h("div", { class: "section-head" },
        h("h2", null, "Everything you need"),
        h("p", null, "Five primitives. The rest is the browser.")
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
      h("span", null, "Brik is a client-side runtime."),
      h("a", { href: "https://github.com/dfralan/brik" }, "github.com/dfralan/brik")
    );
  });
})();
