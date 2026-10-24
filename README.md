<img src="brik.svg" alt="Brik" width="48" height="48">

# Brik

## Just enough to exist.

A tiny reactive runtime for interfaces that build themselves.

One JavaScript file. One CDN. One root component. No npm, no compiler, no virtual DOM.

The runtime is 1863 B gzip.

## Overview

Brik discovers `<brik>` elements and mounts registered components. Those components can create more `<brik>` elements, recursively.

It is a client-side framework. Agents, CLIs, and connectors can drive it through the same public API. Brik itself only renders and reacts.

## Getting Started

### 1. Include Brik

```html
<script defer src="https://brikjs.pages.dev/v1/brik.min.js"></script>
```

Or copy `brik.min.js` next to your page.

### 2. Create a root element

```html
<body>
  <brik app></brik>
  <script defer src="./brik.min.js"></script>
  <script defer src="./app.js"></script>
</body>
```

### 3. Define components

```js
Brik.component("app", function () {
  return "<main><brik header></brik><brik counter></brik></main>";
});

Brik.component("header", function () {
  return Brik.h("h1", null, "Brik");
});

Brik.component("counter", function () {
  var n = Brik.state(0);
  return Brik.h("button", {
    onclick: function () { n.value++; }
  }, function () { return n.value; });
});
```

Five primitives: `component`, `mount`, `h`, `state`, `effect`.

`Brik.mount()` returns an unmount function. Nested `<brik>` descendants mount on their own. Components created after the first load can be mounted with `Brik.mount(node)`.

## State

`Brik.state()` is a `Proxy`. `Brik.effect()` reruns only when a value it read changes. Function children of `Brik.h()` become text nodes that update in place.

```js
var n = Brik.state(0);
Brik.h("span", null, function () { return n.value; });
n.value++;
```

## Security

HTML strings returned by components are trusted.

Untrusted or remote text must go through `Brik.h()` so it becomes a text node. Do not evaluate agent-supplied JavaScript. Do not treat tag-stripping as sanitization. Component names are allowlisted.

## Themes

The official site follows the original Brik light and dark themes, including system preference and a manual toggle.

## Develop

```bash
npm install
npm test
npm run build
```

`dist/` is the Cloudflare Pages output. `/v1/brik.min.js` stays compatible throughout v1.

```bash
npx wrangler pages deploy dist --project-name brikjs
```

## Brik in action

[brikjs.pages.dev](https://brikjs.pages.dev)

## Source

https://github.com/dfralan/brik

## License

Brik is open-source software released under the [MIT License](https://opensource.org/licenses/MIT).
