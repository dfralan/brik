(function (global) {
  "use strict";

  var todos = Brik.state({ list: [] });
  var draft = Brik.state({ value: "" });
  var filter = Brik.state({ value: "all" });

  function visible(list, mode) {
    if (mode === "open") return list.filter(function (item) { return !item.done; });
    if (mode === "done") return list.filter(function (item) { return item.done; });
    return list;
  }

  function tasks() {
    var input = Brik.h("input", {
      class: "brik-field",
      type: "text",
      placeholder: "¿Qué hay que hacer?",
      "aria-label": "Nueva tarea",
      oninput: function (event) { draft.value = event.target.value; },
      onkeydown: function (event) { if (event.key === "Enter") add(); }
    });

    function add() {
      var text = draft.value.trim();
      if (!text) return;
      todos.list = todos.list.concat({
        id: Date.now() + Math.random(),
        text: text,
        done: false
      });
      draft.value = "";
      input.value = "";
      input.focus();
    }

    function toggle(id) {
      todos.list = todos.list.map(function (item) {
        if (item.id !== id) return item;
        return { id: item.id, text: item.text, done: !item.done };
      });
    }

    function remove(id) {
      todos.list = todos.list.filter(function (item) { return item.id !== id; });
    }

    function clearDone() {
      todos.list = todos.list.filter(function (item) { return !item.done; });
    }

    var pending = Brik.h("span", { class: "brik-caption" }, function () {
      var open = todos.list.filter(function (item) { return !item.done; }).length;
      return open + " pendiente" + (open === 1 ? "" : "s");
    });

    var filterBtns = ["all", "open", "done"].map(function (key) {
      var label = key === "all" ? "Todas" : key === "open" ? "Pendientes" : "Hechas";
      var btn = Brik.h("button", {
        class: "brik-button secondary",
        type: "button",
        onclick: function () { filter.value = key; }
      }, label);
      Brik.effect(function () {
        btn.className = "brik-button " + (filter.value === key ? "primary" : "secondary");
      });
      return btn;
    });

    var ul = Brik.h("ul", { class: "tasks-list" });
    var empty = Brik.h("p", { class: "brik-caption" }, "Sin tareas por acá.");
    Brik.effect(function () {
      var list = todos.list;
      var mode = filter.value;
      var shown = visible(list, mode);
      ul.replaceChildren.apply(ul, shown.map(function (item) {
        return Brik.h("li", { class: item.done ? "done" : "" },
          Brik.h("input", {
            class: "brik-check",
            type: "checkbox",
            checked: item.done ? "" : false,
            "aria-label": item.text,
            onchange: function () { toggle(item.id); }
          }),
          Brik.h("span", { class: "tasks-txt" }, item.text),
          Brik.h("button", {
            class: "brik-button ghost tasks-del",
            type: "button",
            "aria-label": "Borrar",
            onclick: function () { remove(item.id); }
          }, "✕")
        );
      }));
      empty.textContent = list.length === 0
        ? "Sin tareas por acá."
        : mode === "open"
          ? "Nada pendiente."
          : mode === "done"
            ? "Todavía no marcaste nada."
            : "";
      empty.hidden = shown.length > 0;
    });

    return Brik.h("div", { class: "tasks brik-stack" },
      Brik.h("h1", { class: "brik-label" }, "Quick Tasks"),
      Brik.h("div", { class: "brik-row tasks-row" },
        input,
        Brik.h("button", { class: "brik-button primary", type: "button", onclick: add }, "Agregar")
      ),
      Brik.h("div", { class: "brik-row tasks-filters" }, filterBtns),
      empty,
      ul,
      Brik.h("div", { class: "tasks-foot" },
        pending,
        Brik.h("button", {
          class: "brik-button ghost",
          type: "button",
          onclick: clearDone
        }, "Limpiar hechas")
      )
    );
  }

  Brik.component("tasks", tasks);

  var layer = null;
  var stop = null;
  var onClose = null;

  function mount(opts) {
    if (stop) return;
    onClose = opts && opts.onClose || null;
    layer = Brik.h("div", { class: "tasks-layer" },
      Brik.h("div", { class: "brik-card tasks-shell" },
        Brik.h("button", {
          class: "brik-button ghost tasks-x",
          type: "button",
          "aria-label": "Close",
          onclick: unmount
        }, "×"),
        Brik.h("brik", { tasks: true })
      )
    );
    document.body.appendChild(layer);
    stop = Brik.mount(layer);
  }

  function unmount() {
    if (!stop) return;
    stop();
    stop = null;
    if (layer && layer.parentNode) layer.parentNode.removeChild(layer);
    layer = null;
    var cb = onClose;
    onClose = null;
    if (cb) cb();
  }

  global.BrikTasks = {
    mount: mount,
    unmount: unmount,
    source: "Brik.component(\"tasks\", " + tasks.toString() + ");"
  };

  var launch = document.getElementById("tasks-open");
  if (launch) {
    launch.addEventListener("click", function () { mount(); });
    mount();
  }
})(window);
