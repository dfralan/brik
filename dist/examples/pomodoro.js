(function (global) {
  "use strict";

  var WORK = 25 * 60;
  var BREAK = 5 * 60;
  var timer = Brik.state({ phase: "work", remaining: WORK, running: false });
  var history = Brik.state({ list: [] });

  function stamp() {
    return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  function nextPhase() {
    var wasWork = timer.phase === "work";
    if (wasWork) {
      history.list = history.list.concat({
        id: Date.now() + Math.random(),
        phase: "work",
        at: stamp()
      });
    }
    timer.phase = wasWork ? "break" : "work";
    timer.remaining = wasWork ? BREAK : WORK;
  }

  function pomodoro() {
    Brik.effect(function () {
      if (!timer.running) return;
      var id = setInterval(function () {
        if (timer.remaining > 1) timer.remaining--;
        else nextPhase();
      }, 1000);
      return function () { clearInterval(id); };
    });

    var bar = Brik.h("progress", {
      class: "brik-progress",
      max: "100",
      value: "0",
      "aria-label": "Session"
    });
    Brik.effect(function () {
      var total = timer.phase === "work" ? WORK : BREAK;
      bar.value = ((total - timer.remaining) / total) * 100;
    });

    var phaseEl = Brik.h("p", { class: "brik-caption pomo-phase" });
    Brik.effect(function () {
      phaseEl.className = "brik-caption pomo-phase " + timer.phase;
        phaseEl.textContent = timer.phase === "work" ? "🍅 Work" : "☕ Break";
    });

    var list = Brik.h("ul", { class: "pomo-list" });
    var empty = Brik.h("p", { class: "brik-caption" }, "No sessions yet.");
    Brik.effect(function () {
      var items = history.list;
      list.replaceChildren.apply(list, items.map(function (item) {
        return Brik.h("li", null,
          Brik.h("span", null, item.phase === "work" ? "🍅 Work" : "☕ Break"),
          Brik.h("span", { class: "brik-caption" }, item.at)
        );
      }));
      empty.hidden = items.length > 0;
    });

    var play = Brik.h("button", {
      class: "brik-button primary",
      type: "button",
      onclick: function () { timer.running = !timer.running; }
    });
    Brik.effect(function () {
      play.textContent = timer.running ? "Pause" : "Start";
    });

    return Brik.h("div", { class: "pomo brik-stack" },
      Brik.h("h1", { class: "brik-label" }, "🍅 Pomodoro"),
      phaseEl,
      Brik.h("div", { class: "pomo-time" }, function () {
        var m = Math.floor(timer.remaining / 60);
        var s = String(timer.remaining % 60).padStart(2, "0");
        return m + ":" + s;
      }),
      bar,
      Brik.h("div", { class: "brik-row" },
        play,
        Brik.h("button", {
          class: "brik-button secondary",
          type: "button",
          onclick: function () {
            timer.running = false;
            timer.phase = "work";
            timer.remaining = WORK;
          }
        }, "Reset"),
        Brik.h("button", { class: "brik-button ghost", type: "button", onclick: nextPhase }, "Skip")
      ),
      Brik.h("h2", { class: "brik-caption pomo-history" }, "History"),
      empty,
      list
    );
  }

  Brik.component("pomodoro", pomodoro);

  var layer = null;
  var stop = null;
  var onClose = null;

  function mount(opts) {
    if (stop) return;
    onClose = opts && opts.onClose || null;
    layer = Brik.h("div", { class: "pomo-layer" },
      Brik.h("div", { class: "brik-card pomo-shell" },
        Brik.h("button", {
          class: "brik-button ghost pomo-x",
          type: "button",
          "aria-label": "Close",
          onclick: unmount
        }, "×"),
        Brik.h("brik", { pomodoro: true })
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

  global.BrikPomodoro = {
    mount: mount,
    unmount: unmount,
    source: "Brik.component(\"pomodoro\", " + pomodoro.toString() + ");"
  };

  var launch = document.getElementById("pomo-open");
  if (launch) {
    launch.addEventListener("click", function () { mount(); });
    mount();
  }
})(window);
