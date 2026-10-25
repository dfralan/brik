/* Brik — just enough to exist. */
(function (global) {
  "use strict";

  var NAME = /^[a-z][a-z0-9-]*$/;
  var RESERVED = { constructor: 1, prototype: 1 };
  var MAX_DEPTH = 32;
  var MAX_FLUSH = 100;

  var registry = Object.create(null);
  var instances = Object.create(null);
  var uid = 0;
  var current = null;
  var listener = null;
  var queue = [];
  var scheduled = 0;

  function validName(name) {
    return typeof name === "string" && NAME.test(name) && !RESERVED[name];
  }

  function plain(value) {
    return value !== null && typeof value === "object" && Object.getPrototypeOf(value) === Object.prototype;
  }

  function schedule(fn) {
    if (queue.indexOf(fn) === -1) queue.push(fn);
    if (!scheduled) {
      scheduled = 1;
      Promise.resolve().then(flush);
    }
  }

  function flush() {
    scheduled = 0;
    var n = 0;
    while (queue.length) {
      if (++n > MAX_FLUSH) {
        queue = [];
        throw new Error("Brik: effect cycle");
      }
      var batch = queue;
      queue = [];
      for (var i = 0; i < batch.length; i++) {
        try {
          batch[i]();
        } catch (err) {
          console.error(err);
        }
      }
    }
  }

  function state(init) {
    var target = plain(init) ? init : { value: init };
    var deps = Object.create(null);

    function track(key) {
      if (!listener) return;
      var list = deps[key] || (deps[key] = []);
      if (list.indexOf(listener.run) === -1) {
        list.push(listener.run);
        listener.subs.push(list);
      }
    }

    function notify(key) {
      var list = deps[key];
      if (!list || !list.length) return;
      var copy = list.slice();
      for (var i = 0; i < copy.length; i++) schedule(copy[i]);
    }

    return new Proxy(target, {
      get: function (obj, key) {
        if (typeof key === "string") track(key);
        return obj[key];
      },
      set: function (obj, key, value) {
        if (!Object.is(obj[key], value)) {
          obj[key] = value;
          notify(key);
        }
        return true;
      }
    });
  }

  function effect(fn) {
    if (typeof fn !== "function") throw new Error("Brik: effect requires a function");
    var owner = current;
    var dead = 0;
    var clean;
    var subs = [];

    function run() {
      if (dead) return;
      for (var i = 0; i < subs.length; i++) {
        var bucket = subs[i];
        var idx = bucket.indexOf(run);
        if (idx !== -1) bucket.splice(idx, 1);
      }
      subs = [];
      if (typeof clean === "function") {
        clean();
        clean = undefined;
      }
      var prev = listener;
      listener = { run: run, subs: subs };
      try {
        clean = fn();
      } finally {
        listener = prev;
      }
    }

    run();

    function stop() {
      if (dead) return;
      dead = 1;
      for (var i = 0; i < subs.length; i++) {
        var bucket = subs[i];
        var idx = bucket.indexOf(run);
        if (idx !== -1) bucket.splice(idx, 1);
      }
      subs = [];
      if (typeof clean === "function") {
        clean();
        clean = undefined;
      }
    }

    if (owner) owner.fx.push(stop);
    return stop;
  }

  function append(el, child) {
    if (child == null || child === false) return;
    if (Array.isArray(child)) {
      for (var i = 0; i < child.length; i++) append(el, child[i]);
      return;
    }
    if (typeof child === "function") {
      var text = document.createTextNode("");
      el.appendChild(text);
      effect(function () {
        var value = child();
        text.textContent = value == null ? "" : String(value);
      });
      return;
    }
    if (child instanceof Node) el.appendChild(child);
    else el.appendChild(document.createTextNode(String(child)));
  }

  function h(tag, props) {
    var el = document.createElement(tag);
    var ref;
    if (props) {
      for (var key in props) {
        if (!Object.prototype.hasOwnProperty.call(props, key)) continue;
        var value = props[key];
        if (value == null || value === false) continue;
        if (key === "class" || key === "className") el.className = value;
        else if (key === "style" && typeof value === "object") {
          for (var name in value) el.style[name] = value[name];
        }         else if (key === "html" || key === "unsafeHTML") el.innerHTML = String(value);
        else if (key === "ref" && typeof value === "function") ref = value;
        else if (key.length > 2 && key.charAt(0) === "o" && key.charAt(1) === "n") {
          if (typeof value === "function") el.addEventListener(key.slice(2).toLowerCase(), value);
        } else el.setAttribute(key, value === true ? "" : value);
      }
    }
    for (var i = 2; i < arguments.length; i++) append(el, arguments[i]);
    if (ref) ref(el);
    return el;
  }

  function component(name, fn) {
    if (!validName(name)) throw new Error("Brik: invalid component name");
    if (typeof fn !== "function") throw new Error("Brik: component must be a function");
    registry[name] = fn;
    return fn;
  }

  function readName(el) {
    var attrs = el.attributes;
    var fallback = null;
    for (var i = 0; i < attrs.length; i++) {
      var name = attrs[i].name;
      if (!validName(name)) continue;
      if (registry[name]) return name;
      if (!fallback) fallback = name;
    }
    return fallback;
  }

  function apply(el, result) {
    if (result == null) return;
    if (typeof result === "string") el.innerHTML = result;
    else if (result instanceof Node) el.replaceChildren(result);
  }

  function dispose(inst) {
    if (!inst || !instances[inst.id]) return;
    for (var i = inst.kids.length - 1; i >= 0; i--) dispose(inst.kids[i]);
    inst.kids = [];
    for (var j = 0; j < inst.fx.length; j++) {
      try {
        inst.fx[j]();
      } catch (err) {
        console.error(err);
      }
    }
    inst.fx = [];
    delete instances[inst.id];
    if (inst.el) {
      delete inst.el.__brik;
      inst.el.textContent = "";
    }
  }

  function mountOne(el, parent, depth) {
    if (el.__brik) return instances[el.__brik];
    if (depth > MAX_DEPTH) throw new Error("Brik: nesting limit");

    var name = readName(el);
    if (!name) return null;
    var fn = registry[name];
    if (!fn) return null;

    var id = ++uid;
    var inst = {
      id: id,
      name: name,
      el: el,
      parent: parent,
      kids: [],
      fx: []
    };
    instances[id] = inst;
    el.__brik = id;
    el.setAttribute("data-brik", name);
    el.removeAttribute(name);
    if (parent) parent.kids.push(inst);

    var prev = current;
    current = inst;
    try {
      var out = fn({ id: id, name: name, el: el });
      if (out && typeof out.then === "function") {
        out.then(function (result) {
          if (!instances[id]) return;
          apply(el, result);
          mountKids(el, inst, depth + 1);
        });
      } else {
        apply(el, out);
        mountKids(el, inst, depth + 1);
      }
    } finally {
      current = prev;
    }
    return inst;
  }

  function isBrik(node) {
    return node && node.tagName && node.tagName.toLowerCase() === "brik";
  }

  function topmost(el, scope) {
    var node = el.parentElement;
    while (node && node !== scope) {
      if (isBrik(node) && !node.__brik) return 0;
      node = node.parentElement;
    }
    return 1;
  }

  function collect(scope) {
    var found = scope.getElementsByTagName("brik");
    var nodes = [];
    for (var i = 0; i < found.length; i++) {
      var el = found[i];
      if (!el.__brik && topmost(el, scope)) nodes.push(el);
    }
    if (isBrik(scope) && !scope.__brik) nodes.unshift(scope);
    return nodes;
  }

  function mountKids(root, parent, depth) {
    var found = root.getElementsByTagName("brik");
    var nodes = [];
    for (var i = 0; i < found.length; i++) nodes.push(found[i]);
    for (var j = 0; j < nodes.length; j++) {
      if (root.contains(nodes[j])) mountOne(nodes[j], parent, depth);
    }
  }

  function resolve(target) {
    if (target == null) {
      return document.querySelector("brik[app]") || document.body || document.documentElement;
    }
    if (typeof target === "string") return document.querySelector(target);
    return target;
  }

  function mount(target) {
    var scope = resolve(target);
    if (!scope) return function () {};
    var roots = isBrik(scope) ? [scope] : collect(scope);
    var mounted = [];
    for (var i = 0; i < roots.length; i++) {
      var inst = mountOne(roots[i], null, 0);
      if (inst) mounted.push(inst);
    }
    return function unmount() {
      for (var j = 0; j < mounted.length; j++) dispose(mounted[j]);
      mounted = [];
    };
  }

  function boot() {
    try {
      if (document.querySelector("brik")) mount();
    } catch (err) {
      console.error(err);
    }
  }

  if (typeof document !== "undefined") {
    if (document.readyState === "complete") Promise.resolve().then(boot);
    else document.addEventListener("DOMContentLoaded", boot);
  }

  global.Brik = {
    component: component,
    mount: mount,
    h: h,
    state: state,
    effect: effect
  };
})(typeof globalThis !== "undefined" ? globalThis : this);
