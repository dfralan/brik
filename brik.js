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

  var BRAND = {};
  var URL_ATTR = { href: 1, src: 1, action: 1, formaction: 1 };

  function isHTML(value) {
    return !!value && value.brand === BRAND;
  }

  function unsafeHTML(value) {
    if (typeof value !== "string") throw new Error("Brik: unsafeHTML");
    return { brand: BRAND, html: value };
  }

  function isEvent(name) {
    name = name.toLowerCase();
    return name.length > 2 && name.charAt(0) === "o" && name.charAt(1) === "n";
  }

  function listen(el, type, fn) {
    effect(function () {
      el.addEventListener(type, fn);
      return function () { el.removeEventListener(type, fn); };
    });
  }

  function urlOK(el, name, value) {
    name = String(name).toLowerCase();
    if (name === "srcdoc") return 0;
    var check = URL_ATTR[name] || (name === "data" && el.tagName === "OBJECT");
    if (!check || value == null || value === false || value === "") return 1;
    try {
      var proto = new URL(String(value).trim(), document.baseURI).protocol;
      if (proto === "http:" || proto === "https:") return 1;
      return name === "href" && (proto === "mailto:" || proto === "tel:");
    } catch (err) {
      return 0;
    }
  }

  function textOf(value) {
    return value == null || value === false ? "" : String(value);
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
      effect(function () { text.textContent = textOf(child()); });
      return;
    }
    if (isHTML(child)) {
      el.appendChild(parseHTML(child.html));
      return;
    }
    if (child instanceof Node) el.appendChild(child);
    else el.appendChild(document.createTextNode(String(child)));
  }

  function assign(el, key, value) {
    if (value == null || value === false) return;
    if (key === "class" || key === "className") {
      if (typeof value === "function") effect(function () { el.className = textOf(value()); });
      else el.className = value;
      return;
    }
    if (key === "style" && value && typeof value === "object" && !isHTML(value)) {
      for (var name in value) el.style[name] = value[name];
      return;
    }
    if (key === "ref" && typeof value === "function") return value;
    if (key === "html") return;
    if (key === "unsafeHTML") {
      if (isHTML(value)) el.appendChild(parseHTML(value.html));
      return;
    }
    if (isEvent(key)) {
      if (typeof value === "function") listen(el, key.slice(2).toLowerCase(), value);
      return;
    }
    if (typeof value === "function") return;
    if (!urlOK(el, key, value)) return;
    el.setAttribute(key, value === true ? "" : value);
  }

  function h(tag, props) {
    var el = document.createElement(tag);
    var ref;
    if (props) {
      for (var key in props) {
        if (!Object.prototype.hasOwnProperty.call(props, key)) continue;
        var got = assign(el, key, props[key]);
        if (typeof got === "function") ref = got;
      }
    }
    for (var i = 2; i < arguments.length; i++) append(el, arguments[i]);
    if (ref) ref(el);
    return el;
  }

  function parseHTML(markup) {
    var tpl = document.createElement("template");
    tpl.innerHTML = markup;
    return tpl.content;
  }

  function holeParts(str, vals) {
    if (str.indexOf("\u0001") === -1) return null;
    var re = /\u0001(\d+)\u0001/g;
    var out = [];
    var last = 0;
    var found = 0;
    var m;
    while ((m = re.exec(str))) {
      found = 1;
      if (m.index > last) out.push(str.slice(last, m.index));
      out.push(vals[+m[1]]);
      last = m.index + m[0].length;
    }
    if (!found) return null;
    if (last < str.length) out.push(str.slice(last));
    return out;
  }

  function put(anchor, value) {
    var parent = anchor.parentNode;
    if (value == null || value === false) {
      parent.removeChild(anchor);
      return;
    }
    if (typeof value === "function") {
      effect(function () { anchor.textContent = textOf(value()); });
      return;
    }
    if (Array.isArray(value)) {
      for (var i = 0; i < value.length; i++) {
        var mark = document.createTextNode("");
        parent.insertBefore(mark, anchor);
        put(mark, value[i]);
      }
      parent.removeChild(anchor);
      return;
    }
    if (isHTML(value)) {
      parent.insertBefore(parseHTML(value.html), anchor);
      parent.removeChild(anchor);
      return;
    }
    if (value instanceof Node) {
      parent.insertBefore(value, anchor);
      parent.removeChild(anchor);
      return;
    }
    anchor.textContent = String(value);
  }

  function expandText(node, vals) {
    var text = node.nodeValue;
    if (!text || text.indexOf("\u0001") === -1) return;
    var parent = node.parentNode;
    var re = /\u0001(\d+)\u0001/g;
    var last = 0;
    var m;
    while ((m = re.exec(text))) {
      if (m.index > last) parent.insertBefore(document.createTextNode(text.slice(last, m.index)), node);
      var anchor = document.createTextNode("");
      parent.insertBefore(anchor, node);
      put(anchor, vals[+m[1]]);
      last = m.index + m[0].length;
    }
    if (last < text.length) node.nodeValue = text.slice(last);
    else parent.removeChild(node);
  }

  function bindAttr(el, name, raw, vals) {
    var key = name.toLowerCase();
    if (key === "srcdoc") {
      el.removeAttribute(name);
      return;
    }
    var parts = holeParts(raw, vals);
    if (isEvent(key)) {
      el.removeAttribute(name);
      el[key] = null;
      if (parts && parts.length === 1 && typeof parts[0] === "function") listen(el, key.slice(2), parts[0]);
      return;
    }
    if (!parts) {
      if (!urlOK(el, key, raw)) el.removeAttribute(name);
      return;
    }
    function render() {
      var present = 0;
      var out = "";
      for (var i = 0; i < parts.length; i++) {
        var bit = parts[i];
        if (typeof bit === "function") bit = bit();
        if (bit == null || bit === false) continue;
        present = 1;
        if (bit !== true) out += String(bit);
      }
      if (!present || !urlOK(el, key, out)) el.removeAttribute(name);
      else el.setAttribute(name, out);
    }
    var dynamic = 0;
    for (var i = 0; i < parts.length; i++) if (typeof parts[i] === "function") dynamic = 1;
    if (dynamic) effect(render);
    else render();
  }

  function walk(node, vals) {
    if (node.nodeType === 11) {
      var roots = [];
      for (var child = node.firstChild; child; child = child.nextSibling) roots.push(child);
      for (var r = 0; r < roots.length; r++) walk(roots[r], vals);
      return;
    }
    if (node.nodeType === 1) {
      if (node.tagName === "SCRIPT") {
        node.parentNode.removeChild(node);
        return;
      }
      var names = [];
      for (var i = 0; i < node.attributes.length; i++) names.push(node.attributes[i].name);
      for (var j = 0; j < names.length; j++) bindAttr(node, names[j], node.getAttribute(names[j]), vals);
      var kids = [];
      for (var next = node.firstChild; next; next = next.nextSibling) kids.push(next);
      for (var k = 0; k < kids.length; k++) walk(kids[k], vals);
      return;
    }
    if (node.nodeType === 3) expandText(node, vals);
  }

  function blank(node) {
    return node && node.nodeType === 3 && !node.nodeValue.trim();
  }

  function unwrap(frag) {
    while (blank(frag.firstChild)) frag.removeChild(frag.firstChild);
    while (blank(frag.lastChild)) frag.removeChild(frag.lastChild);
    return frag.childNodes.length === 1 ? frag.firstChild : frag;
  }

  function html(statics) {
    if (!statics || !statics.raw) throw new Error("Brik: html");
    var vals = [];
    var parts = "";
    for (var i = 0; i < statics.length; i++) {
      parts += statics[i];
      if (i < statics.length - 1) {
        vals.push(arguments[i + 1]);
        parts += "\u0001" + i + "\u0001";
      }
    }
    var frag = parseHTML(parts);
    walk(frag, vals);
    return unwrap(frag);
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
    if (result == null || result === false) return;
    if (typeof result === "string" || typeof result === "number") el.textContent = String(result);
    else if (isHTML(result)) el.replaceChildren(parseHTML(result.html));
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
    html: html,
    unsafeHTML: unsafeHTML,
    state: state,
    effect: effect
  };
})(typeof globalThis !== "undefined" ? globalThis : this);
