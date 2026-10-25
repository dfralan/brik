<img src="brik.svg" alt="Brik" width="48" height="48">

# Brik

## Just enough to exist.

A tiny reactive runtime for interfaces that build themselves.

One JavaScript file. One CDN. One root component. No npm, no compiler, no virtual DOM.

The latest build is 1880 B gzip for the runtime and 2851 B gzip for the theme. `npm run build` prints the current sizes. Theme CSS is a separate, optional file.

## Overview

Brik discovers `<brik>` elements and mounts registered components. Those components can create more `<brik>` elements, recursively.

It is a client-side framework. Agents, CLIs, and connectors can drive it through the same public API. Brik itself only renders and reacts. Agents should start at [llms.txt](https://brikjs.pages.dev/llms.txt).

`brik-theme` is optional. Core works without it.

## Getting Started

### 1. Include Brik

```html
<script defer src="https://brikjs.pages.dev/v1/brik.min.js"></script>
```

Or copy `brik.min.js` next to your page.

Optional theme:

```html
<link rel="stylesheet" href="https://brikjs.pages.dev/v1/brik-theme.min.css">
```

Subresource Integrity for this build:

```html
<script
  defer
  src="https://brikjs.pages.dev/v1/brik.min.js"
  integrity="sha384-vf6CIspQe6kHyNxgwm3oQLeqTVyJjDYoVsDhXceo0hAyE5E9lUpD3zbb2dpQqFXu"
  crossorigin="anonymous"></script>
<link
  rel="stylesheet"
  href="https://brikjs.pages.dev/v1/brik-theme.min.css"
  integrity="sha384-udKfbxA6/SItxNuvRsnD7WD0LaMyZwhtUbR6UyaEMDPYDc7GIMvL51hnVDrrWlyo"
  crossorigin="anonymous">
```

Current hashes are published at [`/v1/integrity.json`](https://brikjs.pages.dev/v1/integrity.json).

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

`Brik.state()` is a shallow `Proxy`. Replacing a tracked property is reactive. Mutating a nested object or array in place is not. `Brik.effect()` reruns only when a value it read changes. Function children of `Brik.h()` become text nodes that update in place.

```js
var n = Brik.state(0);
Brik.h("span", null, function () { return n.value; });
n.value++;
```

Effects created after `await` are not owned by the instance that started the mount.

## Security

HTML strings returned by components, and `html` / `unsafeHTML` on `Brik.h()`, are trusted markup. They are unsafe for external data.

Untrusted or remote text must go through `Brik.h()` as a child so it becomes a text node. String `on*` properties are ignored. `href` and `src` are assigned as written. Do not evaluate agent-supplied JavaScript. Do not treat tag-stripping as sanitization. Component names are allowlisted.

A third-party script runs with the privileges of the host page. Brik does not sandbox modules. For untrusted code, use a sandboxed iframe.

## Theme

`brik-theme` is a standalone stylesheet. It styles native elements. It does not ship components in JavaScript, and the runtime does not require it.

Set `data-theme="light"` or `data-theme="dark"` on `<html>`. Without that attribute, the light tokens apply. Override any token on `:root`:

```css
:root {
  --brik-tint: #601cf2;
}
```

Bricks: page, stack, row, title, label, caption, button, field, card, table, badge, avatar, alert, separator, accordion, checkbox, radio, switch, slider, progress, tabs, dialog, toggle, and tooltip. Button roles are `primary`, `secondary`, `tint`, and `ghost`.

The Pomodoro and Quick Tasks widgets use these bricks. Their own CSS only positions the overlay.

Documented at [brikjs.pages.dev/theme](https://brikjs.pages.dev/theme/) and [the component catalog](https://brikjs.pages.dev/theme/components).

## Modules

A module is a file. It can live in its own repository, use its own version, and ship from any CDN. `brikjs.pages.dev` may host official files. That is not a condition for belonging to the ecosystem.

See [docs/modules.md](docs/modules.md).

Proposed, not implemented: `brik-persist`, `brik-nostr`, `brik-blueprint`, `brik-connect`, `brik-agent`.

## Develop

```bash
npm install
npm test
npm run build
```

`dist/` is the Cloudflare Pages output. `/v1/brik.min.js` and `/v1/brik-theme.min.css` stay compatible throughout v1.

```bash
npx wrangler pages deploy dist --project-name brikjs
```

## Brik in action

[brikjs.pages.dev](https://brikjs.pages.dev)

[Pomodoro widget](https://brikjs.pages.dev/examples/pomodoro.html)

[Quick Tasks widget](https://brikjs.pages.dev/examples/tasks.html)

## Source

https://github.com/dfralan/brik

## License

Brik is open-source software released under the [MIT License](https://opensource.org/licenses/MIT).
