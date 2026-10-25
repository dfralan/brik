(function () {
  var h = Brik.h;
  var INSTALL = '<link rel="stylesheet" href="https://brikjs.pages.dev/v1/brik-theme.min.css">';
  var CATALOG = [
    { id: "accordion", title: "Accordion", body: "Collapsible sections." },
    { id: "alert", title: "Alert", body: "Inline status messages." },
    { id: "avatar", title: "Avatar", body: "A face or initials." },
    { id: "badge", title: "Badge", body: "A compact count or tag." },
    { id: "button", title: "Button", body: "Primary, secondary, tint, ghost." },
    { id: "card", title: "Card", body: "A grouped surface." },
    { id: "checkbox", title: "Checkbox", body: "A binary choice." },
    { id: "dialog", title: "Dialog", body: "A modal on top of the page." },
    { id: "field", title: "Field", body: "Text, select, and textarea." },
    { id: "layout", title: "Layout", body: "Page, stack, and row." },
    { id: "progress", title: "Progress", body: "A determinate bar." },
    { id: "radio", title: "Radio", body: "One choice from a set." },
    { id: "separator", title: "Separator", body: "A quiet line." },
    { id: "slider", title: "Slider", body: "A numeric range." },
    { id: "switch", title: "Switch", body: "An on / off control." },
    { id: "table", title: "Table", body: "Rows and columns." },
    { id: "tabs", title: "Tabs", body: "Peer panels." },
    { id: "toggle", title: "Toggle", body: "A pressed state." },
    { id: "tooltip", title: "Tooltip", body: "A short hint on hover." },
    { id: "type", title: "Type", body: "Title, label, caption." }
  ];

  function findItem(id) {
    for (var i = 0; i < CATALOG.length; i++) {
      if (CATALOG[i].id === id) return CATALOG[i];
    }
    return null;
  }

  function pageId() {
    return document.documentElement.getAttribute("data-brick") || "index";
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

  function copy(text, flag) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        flag.value = true;
        setTimeout(function () { flag.value = false; }, 1400);
      });
    }
  }

  function logo(size) {
    return h("img", {
      src: "/brik.svg",
      width: String(size),
      height: String(size),
      alt: size >= 32 ? "Brik" : ""
    });
  }

  function copyBtn(text) {
    var flag = Brik.state(false);
    return h("button", {
      class: "brik-button ghost copy",
      type: "button",
      "aria-label": "Copy code",
      onclick: function () { copy(typeof text === "function" ? text() : text, flag); }
    }, function () { return flag.value ? "Copied" : "Copy"; });
  }

  function themeToggle() {
    var theme = Brik.state(document.documentElement.getAttribute("data-theme") || "light");
    var sun = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M5 12H3M21 12h-2M6.2 6.2l1.4 1.4M16.4 16.4l1.4 1.4M6.2 17.8l1.4-1.4M16.4 7.6l1.4-1.4"/></svg>';
    var moon = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M15.2 3.1a8.8 8.8 0 1 0 5.7 15.6A8.2 8.2 0 0 1 15.2 3.1z"/></svg>';
    return h("button", {
      class: "brik-button ghost theme",
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
  }

  function nav() {
    return h("header", { class: "nav" },
      h("a", { class: "brand", href: "/" }, logo(22), "Brik"),
      h("div", { class: "nav-links" },
        h("a", { href: "/theme/" }, "Theme"),
        h("a", { href: "/theme/components" }, "Components"),
        h("a", { href: "https://github.com/dfralan/brik" }, "GitHub"),
        themeToggle()
      )
    );
  }

  function tocLinks(spec) {
    var links = [
      ["#overview", "Overview"],
      ["#quick-start", "Quick Start"],
      ["#features", "Key Features"],
      ["#structure", "Structure"]
    ];
    if (spec.examples) {
      for (var i = 0; i < spec.examples.length; i++) {
        links.push(["#" + spec.examples[i].id, spec.examples[i].title]);
      }
    }
    links.push(["#api", "API Reference"]);
    if (spec.attrs && spec.attrs.length) links.push(["#attributes", "Attributes"]);
    return links;
  }

  function side(current, spec) {
    var kids = [
      h("p", { class: "docs-side-label" }, "Theme"),
      h("a", { href: "/theme/", class: current === "index" ? "active" : "" }, "Overview"),
      h("a", { href: "/theme/components", class: current === "components" ? "active" : "" }, "Components"),
      h("p", { class: "docs-side-label" }, "Components")
    ].concat(CATALOG.map(function (item) {
      return h("a", {
        href: "/theme/components/" + item.id,
        class: current === item.id ? "active" : ""
      }, item.title);
    }));
    if (spec) {
      kids.push(h("p", { class: "docs-side-label" }, "On this page"));
      tocLinks(spec).forEach(function (link) {
        kids.push(h("a", { href: link[0] }, link[1]));
      });
    }
    return h("aside", { class: "docs-side" }, kids);
  }

  function foot() {
    return h("footer", { class: "foot" },
      h("p", { class: "made" },
        h("img", { src: "/brik.svg", width: "16", height: "16", alt: "" }),
        "Made with brik"
      ),
      h("a", { href: "https://github.com/dfralan/brik" }, "github.com/dfralan/brik")
    );
  }

  function section(id, title) {
    var kids = Array.prototype.slice.call(arguments, 2);
    return h("section", { class: "docs-section", id: id },
      h("h2", { class: "brik-title" }, title),
      kids
    );
  }

  function table(headers, rows) {
    return h("table", { class: "brik-table docs-props" },
      h("thead", null, h("tr", null, headers.map(function (cell) {
        return h("th", null, cell);
      }))),
      h("tbody", null, rows.map(function (row) {
        return h("tr", null, row.map(function (cell) {
          return h("td", null, cell);
        }));
      }))
    );
  }

  var BOOL_ATTR = { open: 1, checked: 1, disabled: 1, selected: 1, readonly: 1, required: 1, multiple: 1 };
  var source = Brik.state("markup");

  function splitSnippet(code) {
    var cut = code.search(/\n\n[A-Za-z_$]/);
    if (cut === -1) return { html: code, tail: "" };
    return { html: code.slice(0, cut), tail: code.slice(cut).trim() };
  }

  function jsString(value) {
    return JSON.stringify(value);
  }

  function contentNodes(parent) {
    var out = [];
    for (var node = parent.firstChild; node; node = node.nextSibling) {
      if (node.nodeType === 1) out.push(node);
      else if (node.nodeType === 3 && node.nodeValue.trim()) out.push(node);
    }
    return out;
  }

  function printNode(node, depth) {
    var pad = "";
    for (var i = 0; i < depth; i++) pad += "  ";
    if (node.nodeType === 3) return pad + jsString(node.nodeValue.trim());
    var props = [];
    for (var a = 0; a < node.attributes.length; a++) {
      var attr = node.attributes[a];
      var value = attr.value === "" && BOOL_ATTR[attr.name] ? "true" : jsString(attr.value);
      props.push(attr.name + ": " + value);
    }
    var line = "Brik.h(" + jsString(node.tagName.toLowerCase()) + ", " + (props.length ? "{ " + props.join(", ") + " }" : "null");
    var kids = contentNodes(node);
    if (!kids.length) return pad + line + ")";
    if (kids.length === 1 && kids[0].nodeType === 3) return pad + line + ", " + jsString(kids[0].nodeValue.trim()) + ")";
    var lines = [pad + line + ","];
    for (var k = 0; k < kids.length; k++) lines.push(printNode(kids[k], depth + 1) + ",");
    lines.push(pad + ")");
    return lines.join("\n");
  }

  function renderSource(code, mode) {
    if (mode === "markup") return code;
    var parts = splitSnippet(code);
    var tpl = document.createElement("template");
    tpl.innerHTML = parts.html;
    var kids = contentNodes(tpl.content);
    if (!kids.length) return code;
    if (mode === "html") {
      var body = parts.html.replace(/\s+$/, "").split("\n").map(function (line) { return "  " + line; }).join("\n");
      var tagged = "Brik.html`\n" + body + "\n`";
      if (!parts.tail || kids.length !== 1) return tagged;
      var htmlName = parts.tail.split(".")[0];
      return "var " + htmlName + " = " + tagged + ";\n" + parts.tail;
    }
    var calls = kids.map(function (node) { return printNode(node, 0); }).join(";\n");
    if (!parts.tail || kids.length !== 1) return kids.length > 1 ? calls + ";" : calls;
    var name = parts.tail.split(".")[0];
    return "var " + name + " = " + calls + ";\n" + parts.tail;
  }

  function sourceSwitch() {
    var modes = [["markup", "HTML"], ["h", "h()"], ["html", "html"]];
    var buttons = modes.map(function (mode) {
      return h("button", {
        class: "brik-tab",
        type: "button",
        "aria-pressed": "false",
        onclick: function () { source.value = mode[0]; }
      }, mode[1]);
    });
    Brik.effect(function () {
      for (var i = 0; i < modes.length; i++) {
        var on = source.value === modes[i][0];
        buttons[i].className = on ? "brik-tab active" : "brik-tab";
        buttons[i].setAttribute("aria-pressed", on ? "true" : "false");
      }
    });
    return h("div", { class: "docs-style", role: "group", "aria-label": "Write the example as" }, buttons);
  }

  function playground(demoFn, code) {
    var tab = Brik.state("preview");
    var preview = h("div", { class: "docs-demo" }, demoFn());
    var codeEl = h("pre", { class: "docs-code" }, function () { return renderSource(code, source.value); });
    var styles = sourceSwitch();
    var sourcePane = h("div", { class: "docs-source" }, styles, codeEl);
    var previewBtn = h("button", {
      class: "brik-tab active",
      type: "button",
      role: "tab",
      "aria-selected": "true",
      onclick: function () { tab.value = "preview"; }
    }, "Preview");
    var codeBtn = h("button", {
      class: "brik-tab",
      type: "button",
      role: "tab",
      "aria-selected": "false",
      onclick: function () { tab.value = "code"; }
    }, "Code");
    Brik.effect(function () {
      var isPreview = tab.value === "preview";
      previewBtn.className = isPreview ? "brik-tab active" : "brik-tab";
      codeBtn.className = isPreview ? "brik-tab" : "brik-tab active";
      previewBtn.setAttribute("aria-selected", isPreview ? "true" : "false");
      codeBtn.setAttribute("aria-selected", isPreview ? "false" : "true");
      preview.hidden = !isPreview;
      sourcePane.hidden = isPreview;
    });
    return h("div", { class: "docs-play" },
      h("div", { class: "docs-play-bar" },
        h("div", { class: "docs-play-tabs", role: "tablist", "aria-label": "Example" },
          previewBtn,
          codeBtn
        ),
        copyBtn(function () { return renderSource(code, source.value); })
      ),
      preview,
      sourcePane
    );
  }

  function accordion(pairs, opts) {
    opts = opts || {};
    return h("div", { class: "brik-accordion" },
      pairs.map(function (pair, i) {
        var props = { class: "brik-item" };
        if (opts.name) props.name = opts.name;
        if ((opts.openFirst && i === 0) || pair[2]) props.open = "";
        return h("details", props,
          h("summary", null, pair[0]),
          h("div", { class: "brik-content" }, pair[1])
        );
      })
    );
  }

  function dialogBox() {
    var uid = "dlg-" + Math.random().toString(36).slice(2, 8);
    var stay;
    var box = h("dialog", {
      class: "brik-dialog",
      id: uid,
      "aria-labelledby": uid + "-title",
      "aria-describedby": uid + "-desc"
    },
      h("div", { class: "brik-stack" },
        h("h3", { class: "brik-title", id: uid + "-title" }, "Leave?"),
        h("p", { class: "brik-caption", id: uid + "-desc" }, "Unsaved bricks stay in the page. Nothing is sent away."),
        h("div", { class: "brik-row" },
          stay = h("button", {
            class: "brik-button primary",
            type: "button",
            onclick: function () { box.close(); }
          }, "Stay"),
          h("button", {
            class: "brik-button ghost",
            type: "button",
            onclick: function () { box.close(); }
          }, "Leave")
        )
      )
    );
    return h("div", null,
      h("button", {
        class: "brik-button primary",
        type: "button",
        "aria-haspopup": "dialog",
        "aria-controls": uid,
        onclick: function () {
          box.showModal();
          stay.focus();
        }
      }, "Open dialog"),
      box
    );
  }

  function tabsDemo() {
    var tab = Brik.state("one");
    var uid = "tabs-" + Math.random().toString(36).slice(2, 8);
    function btn(id, label) {
      var el = h("button", {
        class: "brik-tab",
        type: "button",
        role: "tab",
        id: uid + "-" + id,
        "aria-controls": uid + "-panel",
        onclick: function () { tab.value = id; }
      }, label);
      Brik.effect(function () {
        var on = tab.value === id;
        el.className = "brik-tab" + (on ? " active" : "");
        el.setAttribute("aria-selected", on ? "true" : "false");
        el.tabIndex = on ? 0 : -1;
      });
      return el;
    }
    var copy = {
      one: "The first panel. A quiet caption under the tabs.",
      two: "The second panel. Same place, other words.",
      three: "The third panel. Nothing else moves."
    };
    var panel = h("p", {
      class: "brik-caption",
      id: uid + "-panel",
      role: "tabpanel",
      "aria-labelledby": uid + "-one"
    });
    Brik.effect(function () {
      panel.textContent = copy[tab.value];
      panel.setAttribute("aria-labelledby", uid + "-" + tab.value);
    });
    return h("div", { class: "brik-stack" },
      h("div", { class: "brik-tabs", role: "tablist", "aria-label": "Panels" },
        btn("one", "One"),
        btn("two", "Two"),
        btn("three", "Three")
      ),
      panel
    );
  }

  function toggleDemo() {
    function one(label, start) {
      var on = Brik.state(start);
      var el = h("button", {
        class: "brik-button secondary brik-toggle",
        type: "button",
        onclick: function () { on.value = !on.value; }
      }, label);
      Brik.effect(function () {
        el.setAttribute("aria-pressed", on.value ? "true" : "false");
      });
      return el;
    }
    return h("div", { class: "brik-row" }, one("Bold", true), one("Italic", false));
  }

  var PREVIEW = {
    accordion: function () {
      return accordion([
        ["What is a brick?", "A class on a native element. The browser already knows what to do."],
        ["Does it need Brik?", "No. The stylesheet works alone."]
      ], { openFirst: true });
    },
    alert: function () {
      return h("div", { class: "brik-alert" },
        h("p", { class: "brik-label" }, "Saved"),
        h("p", { class: "brik-caption" }, "Your changes stay in this page.")
      );
    },
    avatar: function () {
      return h("div", { class: "brik-row" },
        h("span", { class: "brik-avatar" }, "AL"),
        h("span", { class: "brik-avatar" }, "BK"),
        h("span", { class: "brik-avatar" }, "M")
      );
    },
    badge: function () {
      return h("div", { class: "brik-row" },
        h("span", { class: "brik-badge primary" }, "v1"),
        h("span", { class: "brik-badge" }, "CSS"),
        h("span", { class: "brik-badge" }, "Native")
      );
    },
    button: function () { return roles("brik-row"); },
    card: function () {
      return h("div", { class: "brik-card brik-stack" },
        h("h3", { class: "brik-label" }, "A surface"),
        h("p", { class: "brik-caption" }, "Title, caption, then the action."),
        h("div", { class: "brik-row" },
          h("button", { class: "brik-button primary", type: "button" }, "Save"),
          h("button", { class: "brik-button ghost", type: "button" }, "Cancel")
        )
      );
    },
    checkbox: function () {
      return h("div", { class: "brik-stack" },
        h("label", { class: "brik-row" }, h("input", { class: "brik-check", type: "checkbox", checked: "" }), h("span", { class: "brik-label" }, "Remember this")),
        h("label", { class: "brik-row" }, h("input", { class: "brik-check", type: "checkbox" }), h("span", { class: "brik-label" }, "Write it down"))
      );
    },
    dialog: function () {
      return h("button", { class: "brik-button primary", type: "button" }, "Open dialog");
    },
    field: function () {
      return h("div", { class: "brik-stack" },
        h("label", { class: "brik-label", "for": "name-field" }, "Name"),
        h("input", { class: "brik-field", id: "name-field", type: "text", value: "Ada Lovelace" })
      );
    },
    layout: function () {
      return h("div", { class: "brik-stack" },
        h("div", { class: "brik-row" },
          h("button", { class: "brik-button primary", type: "button" }, "One"),
          h("button", { class: "brik-button ghost", type: "button" }, "Two")
        ),
        h("p", { class: "brik-caption" }, "A stack holding a row.")
      );
    },
    progress: function () {
      return h("div", { class: "brik-stack" },
        h("progress", { class: "brik-progress", value: "64", max: "100", "aria-label": "Progress" }),
        h("p", { class: "brik-caption" }, "64 of 100")
      );
    },
    radio: function () {
      return h("div", { class: "brik-stack" },
        h("label", { class: "brik-row" }, h("input", { class: "brik-radio", type: "radio", name: "preview-plan", checked: "" }), h("span", { class: "brik-label" }, "Free")),
        h("label", { class: "brik-row" }, h("input", { class: "brik-radio", type: "radio", name: "preview-plan" }), h("span", { class: "brik-label" }, "Own the files"))
      );
    },
    separator: function () {
      return h("div", { class: "brik-stack" },
        h("p", { class: "brik-label" }, "Above"),
        h("hr", { class: "brik-sep" }),
        h("p", { class: "brik-caption" }, "Below")
      );
    },
    slider: function () {
      return h("div", { class: "brik-stack" },
        h("input", { class: "brik-slider", type: "range", min: "0", max: "100", value: "40", "aria-label": "Amount" }),
        h("p", { class: "brik-caption" }, "40")
      );
    },
    switch: function () {
      return h("label", { class: "brik-row" },
        h("input", { class: "brik-switch", type: "checkbox", checked: "" }),
        h("span", { class: "brik-label" }, "Dark ready")
      );
    },
    table: function () {
      return h("table", { class: "brik-table" },
        h("thead", null, h("tr", null, h("th", null, "Brick"), h("th", null, "Role"))),
        h("tbody", null,
          h("tr", null, h("td", null, "button"), h("td", null, "Action")),
          h("tr", null, h("td", null, "field"), h("td", null, "Input")),
          h("tr", null, h("td", null, "card"), h("td", null, "Surface"))
        )
      );
    },
    tabs: function () {
      return h("div", { class: "brik-stack" },
        h("div", { class: "brik-tabs" },
          h("button", { class: "brik-tab active", type: "button" }, "One"),
          h("button", { class: "brik-tab", type: "button" }, "Two"),
          h("button", { class: "brik-tab", type: "button" }, "Three")
        ),
        h("p", { class: "brik-caption" }, "First panel.")
      );
    },
    toggle: function () {
      return h("div", { class: "brik-row" },
        h("button", { class: "brik-button secondary brik-toggle", type: "button", "aria-pressed": "true" }, "Bold"),
        h("button", { class: "brik-button secondary brik-toggle", type: "button", "aria-pressed": "false" }, "Italic")
      );
    },
    tooltip: function () {
      return h("button", {
        class: "brik-button secondary brik-tip",
        type: "button",
        "data-tip": "Copied to the clipboard",
        "aria-label": "Hover me. Copied to the clipboard"
      }, "Hover me");
    },
    type: function () {
      return h("div", { class: "brik-stack" },
        h("h2", { class: "brik-title" }, "Title"),
        h("p", { class: "brik-label" }, "Label"),
        h("p", { class: "brik-caption" }, "Caption")
      );
    }
  };

  var FAQ = [
    ["What is a brick?", "A class on a native element. No runtime."],
    ["Does it need Brik?", "No. Brik is optional. The stylesheet works alone."],
    ["Can I theme it?", "Override --brik-accent, --brik-bg, or data-theme."]
  ];

  var ACCORDION_CODE = [
    "<div class=\"brik-accordion\">",
    "  <details class=\"brik-item\" open>",
    "    <summary>What is a brick?</summary>",
    "    <div class=\"brik-content\">A class on a native element.</div>",
    "  </details>",
    "</div>"
  ].join("\n");

  var SPECS = {
    accordion: {
      overview: "Organizes content into collapsible sections so a reader can open only what they need. The brick is native <details> and <summary>. The browser owns open state, keyboard, and find-in-page.",
      features: [
        "Multiple sections can stay open. That is the default for details.",
        "Exclusive groups use the native name attribute. One open at a time.",
        "No JavaScript. Open, close, and focus come from the element.",
        "Pre-open a section with the open attribute."
      ],
      structure: [
        [".brik-accordion", "div", "Root"],
        [".brik-item", "details", "Section"],
        ["summary", "summary", "Trigger"],
        [".brik-content", "div", "Panel"]
      ],
      demo: function () { return accordion(FAQ, { openFirst: true }); },
      code: ACCORDION_CODE,
      examples: [
        {
          id: "exclusive",
          title: "Single group",
          body: "Give every item the same name. The browser closes the others when one opens.",
          demo: function () {
            return accordion(FAQ, { name: "faq", openFirst: true });
          },
          code: "<details class=\"brik-item\" name=\"faq\" open>\n  <summary>What is a brick?</summary>\n  <div class=\"brik-content\">A class on a native element.</div>\n</details>"
        },
        {
          id: "closed",
          title: "All closed",
          body: "Omit open. Nothing is expanded until the reader chooses.",
          demo: function () { return accordion(FAQ); },
          code: "<details class=\"brik-item\">\n  <summary>What is a brick?</summary>\n  <div class=\"brik-content\">A class on a native element.</div>\n</details>"
        }
      ],
      api: [
        [".brik-accordion", "Root list"],
        [".brik-item", "details section"],
        ["summary", "Visible trigger"],
        [".brik-content", "Body when open"]
      ],
      attrs: [
        ["open", "Present when the section is expanded."],
        ["name", "Same value groups items so only one stays open."]
      ]
    },
    alert: {
      overview: "A quiet status surface. Use it for saved state, hints, and errors that belong in the page, not in a modal.",
      features: [
        "Default alert sits on the field color.",
        "Add tint for an accent edge.",
        "Compose with title and caption."
      ],
      structure: [[".brik-alert", "div", "Surface"], [".tint", "modifier", "Accent edge"]],
      demo: function () {
        return h("div", { class: "brik-stack" },
          h("div", { class: "brik-alert" },
            h("p", { class: "brik-label" }, "Saved"),
            h("p", { class: "brik-caption" }, "Your changes stay in this page.")
          ),
          h("div", { class: "brik-alert tint" },
            h("p", { class: "brik-label" }, "Hint"),
            h("p", { class: "brik-caption" }, "Override --brik-tint when you want a voice.")
          )
        );
      },
      code: "<div class=\"brik-alert tint\">\n  <p class=\"brik-label\">Hint</p>\n  <p class=\"brik-caption\">Override --brik-tint.</p>\n</div>",
      api: [[".brik-alert", "Surface"], [".tint", "Accent edge"]],
      attrs: []
    },
    avatar: {
      overview: "A face, a mark, or initials. Keep it small. The brick is a circle; an img fills it.",
      features: ["Initials as text.", "Photo via img.", "Same size in a row of people."],
      structure: [[".brik-avatar", "span", "Circle"], ["img", "img", "Photo"]],
      demo: PREVIEW.avatar,
      code: "<span class=\"brik-avatar\">AL</span>\n<span class=\"brik-avatar\"><img src=\"/face.jpg\" alt=\"Ada\"></span>",
      api: [[".brik-avatar", "Circle"]],
      attrs: []
    },
    badge: {
      overview: "A compact count, version, or status. Use primary when the tag should hold the accent.",
      features: ["Muted by default.", "primary fills with --brik-primary."],
      structure: [[".brik-badge", "span", "Tag"], [".primary", "modifier", "Filled"]],
      demo: PREVIEW.badge,
      code: "<span class=\"brik-badge\">Proposed</span>\n<span class=\"brik-badge primary\">v1</span>",
      api: [[".brik-badge", "Tag"], [".primary", "Filled"]],
      attrs: []
    },
    button: {
      overview: "The action brick. Roles map to SwiftUI-style intent: primary, secondary, tint, ghost. Same control, four weights.",
      features: [
        "primary is the filled default. Ink on the page color.",
        "secondary is an outline.",
        "tint is the violet accent. The same color as the focus ring.",
        "ghost is text. No fill until hover."
      ],
      structure: [
        [".brik-button", "button or a", "Control"],
        [".primary", "modifier", "Filled"],
        [".secondary", "modifier", "Outline"],
        [".tint", "modifier", "Soft accent"],
        [".ghost", "modifier", "Bare"]
      ],
      demo: PREVIEW.button,
      code: "<button class=\"brik-button primary\">Primary</button>\n<button class=\"brik-button secondary\">Secondary</button>\n<button class=\"brik-button tint\">Tint</button>\n<button class=\"brik-button ghost\">Ghost</button>",
      examples: [
        {
          id: "link",
          title: "As a link",
          body: "The same classes work on an anchor when the action navigates.",
          demo: function () {
            return h("a", { class: "brik-button primary", href: "/theme/components" }, "Browse components");
          },
          code: "<a class=\"brik-button primary\" href=\"/theme/components\">Browse components</a>"
        }
      ],
      api: [
        [".brik-button", "Control"],
        [".primary", "Filled"],
        [".secondary", "Outline"],
        [".tint", "Violet accent"],
        [".ghost", "Bare"]
      ],
      attrs: [["type", "button, submit, or reset on a button."], ["disabled", "Native disabled state."]]
    },
    card: {
      overview: "A grouped surface. Put a title, a caption, and actions inside a stack.",
      features: ["Field background.", "Radius from --brik-radius.", "No shadow."],
      structure: [[".brik-card", "div", "Surface"]],
      demo: PREVIEW.card,
      code: "<div class=\"brik-card\">\n  <h3 class=\"brik-label\">Card</h3>\n  <p class=\"brik-caption\">A brick for grouping content.</p>\n</div>",
      api: [[".brik-card", "Surface"]],
      attrs: []
    },
    checkbox: {
      overview: "A binary choice. Use the native checkbox. The brick only sets accent-color.",
      features: ["Works with a label in a row.", "Checked is the native attribute."],
      structure: [[".brik-check", "input", "checkbox"]],
      demo: PREVIEW.checkbox,
      code: "<label class=\"brik-row\">\n  <input class=\"brik-check\" type=\"checkbox\">\n  <span class=\"brik-label\">Remember this</span>\n</label>",
      api: [[".brik-check", "input checkbox"]],
      attrs: [["checked", "On when selected."], ["disabled", "Native disabled state."], ["name", "Form key."]]
    },
    dialog: {
      overview: "A modal on top of the page. Use the native dialog element. Open it with showModal(). The brick styles the box and the backdrop.",
      features: [
        "showModal() locks the page and paints ::backdrop.",
        "Escape and the backdrop close behavior stay with the browser.",
        "Put a title, caption, and actions in a stack."
      ],
      structure: [[".brik-dialog", "dialog", "Modal"], ["::backdrop", "pseudo", "Scrim"]],
      demo: dialogBox,
      code: "<dialog class=\"brik-dialog\">\n  <h3 class=\"brik-title\">Leave?</h3>\n  <button>Stay</button>\n</dialog>\n\ndialog.showModal()",
      api: [[".brik-dialog", "dialog"], ["::backdrop", "Scrim"]],
      attrs: [["open", "Present when the dialog is shown without showModal."]]
    },
    field: {
      overview: "One class for text, select, and textarea. The brick is the chrome; the element is still the input.",
      features: ["Full width.", "Same padding and radius on every field.", "Textarea grows vertically."],
      structure: [[".brik-field", "input, select, textarea", "Control"]],
      demo: function () {
        return h("div", { class: "brik-stack" },
          h("input", { class: "brik-field", type: "text", value: "Ada Lovelace", "aria-label": "Name" }),
          h("select", { class: "brik-field", "aria-label": "Role" }, h("option", null, "Author"), h("option", null, "Editor")),
          h("textarea", { class: "brik-field", "aria-label": "Notes" }, "A note.")
        );
      },
      code: "<input class=\"brik-field\" type=\"text\">\n<select class=\"brik-field\"></select>\n<textarea class=\"brik-field\"></textarea>",
      api: [[".brik-field", "input, select, textarea"]],
      attrs: [["type", "text, email, password, and the rest."], ["disabled", "Native disabled state."], ["required", "Form validation."]]
    },
    layout: {
      overview: "The page is a column. Stacks go down. Rows go across. These three classes are how every other brick is composed.",
      features: [
        "brik-page centers a readable measure.",
        "brik-stack is a vertical flex with --brik-space.",
        "brik-row wraps and aligns items."
      ],
      structure: [
        [".brik-page", "div", "Measure"],
        [".brik-stack", "div", "Column"],
        [".brik-row", "div", "Wrap row"]
      ],
      demo: function () {
        return h("div", { class: "brik-stack" },
          h("div", { class: "brik-row" },
            h("button", { class: "brik-button primary", type: "button" }, "One"),
            h("button", { class: "brik-button ghost", type: "button" }, "Two")
          ),
          h("p", { class: "brik-caption" }, "A stack of a row and a caption.")
        );
      },
      code: "<div class=\"brik-page\">\n  <div class=\"brik-stack\">\n    <div class=\"brik-row\">...</div>\n  </div>\n</div>",
      api: [[".brik-page", "Centered page"], [".brik-stack", "Column"], [".brik-row", "Row"]],
      attrs: []
    },
    progress: {
      overview: "A determinate bar. Use the native progress element with value and max.",
      features: ["Accent from --brik-primary.", "Track uses the field color."],
      structure: [[".brik-progress", "progress", "Bar"]],
      demo: PREVIEW.progress,
      code: "<progress class=\"brik-progress\" value=\"64\" max=\"100\"></progress>",
      api: [[".brik-progress", "progress"]],
      attrs: [["value", "Current amount."], ["max", "Upper bound."]]
    },
    radio: {
      overview: "One choice from a set. Same name groups the inputs. The brick sets accent-color.",
      features: ["Native grouping via name.", "Label in a row."],
      structure: [[".brik-radio", "input", "radio"]],
      demo: PREVIEW.radio,
      code: "<label class=\"brik-row\">\n  <input class=\"brik-radio\" type=\"radio\" name=\"plan\" checked>\n  <span>Free</span>\n</label>",
      api: [[".brik-radio", "input radio"]],
      attrs: [["name", "Group key."], ["checked", "The selected option."], ["disabled", "Native disabled state."]]
    },
    separator: {
      overview: "A quiet line. Use it between blocks when a new heading would be too much.",
      features: ["One pixel.", "Color from --brik-line."],
      structure: [[".brik-sep", "hr", "Line"]],
      demo: function () {
        return h("div", { class: "brik-stack" },
          h("p", { class: "brik-label" }, "Above"),
          h("hr", { class: "brik-sep" }),
          h("p", { class: "brik-caption" }, "Below")
        );
      },
      code: "<hr class=\"brik-sep\">",
      api: [[".brik-sep", "hr"]],
      attrs: []
    },
    slider: {
      overview: "A numeric range. The native range input, with accent-color.",
      features: ["Full width.", "min, max, and value stay on the element."],
      structure: [[".brik-slider", "input", "range"]],
      demo: PREVIEW.slider,
      code: "<input class=\"brik-slider\" type=\"range\" min=\"0\" max=\"100\" value=\"40\">",
      api: [[".brik-slider", "input range"]],
      attrs: [["min", "Lower bound."], ["max", "Upper bound."], ["value", "Current number."], ["step", "Increment."]]
    },
    switch: {
      overview: "An on / off control that looks like a track. It is still a checkbox. Screen readers already know what to do.",
      features: ["appearance none, then a track and a thumb.", "checked paints --brik-primary.", "Pair it with a label."],
      structure: [[".brik-switch", "input", "checkbox"]],
      demo: PREVIEW.switch,
      code: "<label class=\"brik-row\">\n  <input class=\"brik-switch\" type=\"checkbox\">\n  <span class=\"brik-label\">Dark ready</span>\n</label>",
      api: [[".brik-switch", "input checkbox"]],
      attrs: [["checked", "On when the track is filled."], ["disabled", "Native disabled state."]]
    },
    table: {
      overview: "Rows and columns. The brick is a full-width table with a quiet header and hairline rows.",
      features: ["Header uses muted type.", "Cells share one padding."],
      structure: [[".brik-table", "table", "Table"], ["th", "th", "Header"], ["td", "td", "Cell"]],
      demo: PREVIEW.table,
      code: "<table class=\"brik-table\">\n  <thead><tr><th>Brick</th><th>Role</th></tr></thead>\n  <tbody><tr><td>button</td><td>Action</td></tr></tbody>\n</table>",
      api: [[".brik-table", "table"]],
      attrs: []
    },
    tabs: {
      overview: "Peer panels. The brick is the tablist chrome. Selection is yours: a class, aria-selected, and a panel you swap.",
      features: [
        "active or aria-selected=\"true\" paints the current tab.",
        "The panel is not implied. Render the one that matches.",
        "Brik.state is enough when you want it live."
      ],
      structure: [[".brik-tabs", "div", "Tablist"], [".brik-tab", "button", "Tab"], [".active", "modifier", "Selected"]],
      demo: tabsDemo,
      code: "<div class=\"brik-tabs\">\n  <button class=\"brik-tab active\" aria-selected=\"true\">One</button>\n  <button class=\"brik-tab\">Two</button>\n  <button class=\"brik-tab\">Three</button>\n</div>",
      api: [[".brik-tabs", "Row"], [".brik-tab", "Trigger"], [".active", "Selected"]],
      attrs: [["aria-selected", "true on the current tab."]]
    },
    toggle: {
      overview: "A button with a pressed state. Use aria-pressed. The brick fills when it is true.",
      features: ["Compose with brik-button.", "Pressed uses the primary fill."],
      structure: [[".brik-toggle", "button", "Toggle"], ["aria-pressed", "state", "On"]],
      demo: toggleDemo,
      code: "<button class=\"brik-button secondary brik-toggle\" aria-pressed=\"false\">Bold</button>",
      api: [[".brik-toggle", "Pressed via aria-pressed"]],
      attrs: [["aria-pressed", "true when the toggle is on."]]
    },
    tooltip: {
      overview: "A short hint on hover. The text lives in data-tip. No portal, no runtime.",
      features: ["Appears above the control.", "CSS only.", "Keep the string short."],
      structure: [[".brik-tip", "button or span", "Anchor"], ["[data-tip]", "attribute", "Text"]],
      demo: function () {
        return h("button", {
          class: "brik-button secondary brik-tip",
          type: "button",
          "data-tip": "Copied to the clipboard",
          "aria-label": "Hover me. Copied to the clipboard"
        }, "Hover me");
      },
      code: "<button class=\"brik-tip\" data-tip=\"Copied to the clipboard\">Hover me</button>",
      api: [[".brik-tip", "Anchor"], ["[data-tip]", "Text"]],
      attrs: [["data-tip", "The hint string."]]
    },
    type: {
      overview: "Three voices. Title for the page, label for a strong line, caption for the quiet one.",
      features: ["title is the heading.", "label is semibold.", "caption is muted and smaller."],
      structure: [[".brik-title", "h1–h3", "Heading"], [".brik-label", "p or span", "Strong"], [".brik-caption", "p", "Muted"]],
      demo: function () {
        return h("div", { class: "brik-stack" },
          h("h2", { class: "brik-title" }, "Title"),
          h("p", { class: "brik-label" }, "Label"),
          h("p", { class: "brik-caption" }, "Caption")
        );
      },
      code: "<h2 class=\"brik-title\">Title</h2>\n<p class=\"brik-label\">Label</p>\n<p class=\"brik-caption\">Caption</p>",
      api: [[".brik-title", "Heading"], [".brik-label", "Strong"], [".brik-caption", "Muted"]],
      attrs: []
    }
  };

  function pager(id) {
    var index = -1;
    for (var i = 0; i < CATALOG.length; i++) {
      if (CATALOG[i].id === id) index = i;
    }
    var prev = index > 0 ? CATALOG[index - 1] : null;
    var next = index >= 0 && index < CATALOG.length - 1 ? CATALOG[index + 1] : null;
    return h("nav", { class: "docs-pager" },
      prev
        ? h("a", { href: "/theme/components/" + prev.id }, "← " + prev.title)
        : h("span", null, ""),
      next
        ? h("a", { href: "/theme/components/" + next.id }, next.title + " →")
        : h("span", null, "")
    );
  }

  Brik.component("theme-docs", function () {
    var id = pageId();
    if (id === "index") {
      return h("div", { class: "page" }, nav(), home(), foot());
    }
    if (id === "components") {
      return h("div", { class: "page" },
        nav(),
        h("div", { class: "docs-body" }, side(id), h("main", null, catalog())),
        foot()
      );
    }
    var spec = SPECS[id];
    var item = findItem(id);
    if (!spec || !item) {
      return h("div", { class: "page" },
        nav(),
        h("div", { class: "docs-body" }, side("components"), h("main", null, catalog())),
        foot()
      );
    }
    return h("div", { class: "page" },
      nav(),
      h("div", { class: "docs-body" }, side(id, spec), h("main", null, detail(item, spec))),
      foot()
    );
  });

  function home() {
    var copied = Brik.state(false);
    var points = [
      { title: "Native", body: "Classes on elements the browser already knows. details, dialog, progress, input." },
      { title: "Tokens", body: "One sheet. Light, dark, and the accent you override." },
      { title: "No runtime", body: "The CSS works without Brik. Brik is optional glue." },
      { title: "Same page", body: "The same measure, type, and field color as the rest of Brik." }
    ];
    return h("div", null,
      h("section", { class: "hero" },
        logo(48),
        h("h1", null, "The bricks", h("br"), "for the web."),
        h("p", { class: "lede" }, "A CSS component library. Tokens, roles, and native elements."),
        h("div", { class: "command" },
          h("code", null, INSTALL),
          h("button", {
            class: "brik-button ghost copy",
            type: "button",
            onclick: function () { copy(INSTALL, copied); }
          }, function () { return copied.value ? "Copied" : "Copy"; })
        ),
        h("p", { class: "brik-caption hint" }, "One stylesheet. Light and dark. No JavaScript required.")
      ),
      h("section", { class: "section" },
        h("div", { class: "section-head" },
          h("h2", { class: "brik-title" }, "Why a theme"),
          h("p", null, "Not a new language. The HTML you already write, with roles.")
        ),
        h("div", { class: "grid" },
          points.map(function (item) {
            return h("article", { class: "brik-card" },
              h("h3", { class: "brik-title" }, item.title),
              h("p", null, item.body)
            );
          })
        )
      ),
      h("section", { class: "section" },
        h("div", { class: "section-head" },
          h("h2", { class: "brik-title" }, "See it running"),
          h("p", null, "These are the bricks, not mocks.")
        ),
        h("div", { class: "docs-stage" },
          h("div", { class: "brik-stack" },
            h("div", { class: "docs-identity" },
              h("span", { class: "brik-avatar" }, "BK"),
              h("div", { class: "brik-stack" },
                h("p", { class: "brik-label" }, "brik-theme"),
                h("p", { class: "brik-caption" }, "Tokens, roles, native elements.")
              ),
              h("span", { class: "brik-badge primary" }, "v1")
            ),
            h("hr", { class: "brik-sep" }),
            accordion(FAQ, { openFirst: true }),
            h("hr", { class: "brik-sep" }),
            h("div", { class: "brik-row" },
              h("label", { class: "brik-row" },
                h("input", { class: "brik-switch", type: "checkbox", checked: "" }),
                h("span", { class: "brik-label" }, "Dark ready")
              ),
              h("button", { class: "brik-button ghost", type: "button" }, "Save")
            )
          )
        )
      ),
      h("section", { class: "section" },
        h("div", { class: "section-head" },
          h("h2", { class: "brik-title" }, "Components"),
          h("p", null,
            "Twenty bricks. ",
            h("a", { href: "/theme/components" }, "Browse the catalog")
          )
        ),
        h("div", { class: "grid" },
          ["accordion", "button", "dialog", "switch"].map(function (id) {
            return card(findItem(id), PREVIEW[id]);
          })
        )
      )
    );
  }

  function roles(layout) {
    return h("div", { class: layout },
      h("button", { class: "brik-button primary", type: "button" }, "Primary"),
      h("button", { class: "brik-button secondary", type: "button" }, "Secondary"),
      h("button", { class: "brik-button tint", type: "button" }, "Tint"),
      h("button", { class: "brik-button ghost", type: "button" }, "Ghost")
    );
  }

  function card(item, preview) {
    var demo = item.id === "button" ? roles("brik-stack docs-roles") : preview();
    return h("article", { class: "docs-card brik-card" },
      h("h3", { class: "brik-title" }, item.title),
      h("p", null, item.body),
      h("div", { class: "docs-mini" }, demo),
      h("a", {
        class: "docs-card-link",
        href: "/theme/components/" + item.id,
        "aria-label": item.title
      })
    );
  }

  function catalog() {
    var query = Brik.state("");
    var grid = h("div", { class: "docs-grid" });
    function paint() {
      var q = query.value.toLowerCase();
      var items = CATALOG.filter(function (item) {
        return !q || item.title.toLowerCase().indexOf(q) !== -1 || item.body.toLowerCase().indexOf(q) !== -1;
      });
      grid.replaceChildren();
      items.forEach(function (item) {
        grid.appendChild(card(item, PREVIEW[item.id]));
      });
    }
    Brik.effect(paint);
    return h("div", null,
      h("div", { class: "section-head" },
        h("h1", null, "Components"),
        h("p", null, "Every brick in brik-theme. Open one for a live preview, the markup, and the API.")
      ),
      h("input", {
        class: "brik-field docs-search",
        type: "search",
        placeholder: "Search components",
        "aria-label": "Search components",
        oninput: function (event) { query.value = event.target.value; }
      }),
      grid
    );
  }

  function detail(item, spec) {
    var blocks = [
      h("div", { class: "section-head" },
        h("h1", null, item.title),
        h("p", null, item.body)
      ),
      playground(spec.demo, spec.code),
      section("overview", "Overview", h("p", null, spec.overview)),
      section("quick-start", "Quick Start", h("pre", { class: "docs-code" }, spec.code)),
      section("features", "Key Features", h("ul", null, spec.features.map(function (line) {
        return h("li", null, line);
      }))),
      section("structure", "Structure", table(["Part", "Element", "Role"], spec.structure))
    ];
    if (spec.examples) {
      for (var i = 0; i < spec.examples.length; i++) {
        var example = spec.examples[i];
        blocks.push(section(example.id, example.title, h("p", null, example.body), playground(example.demo, example.code)));
      }
    }
    blocks.push(section("api", "API Reference", table(["Class", "Role"], spec.api)));
    if (spec.attrs && spec.attrs.length) {
      blocks.push(section("attributes", "Attributes", table(["Attribute", "Description"], spec.attrs)));
    }
    blocks.push(pager(item.id));
    return h("div", { class: "brik-stack" }, blocks);
  }
})();
