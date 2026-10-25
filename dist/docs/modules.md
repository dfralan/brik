# Standalone Brik modules

A module is a JavaScript file, a stylesheet, or both. It is not registered with Brik. There is no loader, manifest, or marketplace.

`brikjs.pages.dev` may host official files. It is not required. A module can live in its own repository, use its own version, and ship from any CDN.

## What to document

- Name and purpose
- Author and source repository
- Compatible Brik Core versions
- Dependencies, if any
- Installation URL
- Public API and a short usage example
- Security permissions and any external access

## Rules

- Use the public API: `component`, `mount`, `h`, `state`, `effect`.
- Do not monkey-patch Brik internals or read private variables.
- Prefer an exact, versioned HTTPS URL.
- Publish a checksum. Consumers can use Subresource Integrity:

```html
<link
  rel="stylesheet"
  href="https://example.com/v1/my-theme.min.css"
  integrity="sha384-..."
  crossorigin="anonymous">
```

Official checksums for files on `brikjs.pages.dev` are listed in `/v1/integrity.json`. Theme bricks are documented at `/theme/` and `/theme/components`.

A third-party script runs with the privileges of the host page. Brik does not sandbox modules. For untrusted code, load it in a sandboxed iframe.

If a feature seems missing from Core, implement it outside Core first. Only a general-purpose primitive belongs in `brik.js`.

## Proposed modules

These names are reserved as possibilities. They are not published.

- `brik-persist` — LocalStorage / IndexedDB persistence
- `brik-nostr` — optional Nostr identity and sync
- `brik-blueprint` — declarative, persistent UI descriptions
- `brik-connect` — adapters for external data sources
- `brik-agent` — optional agent-driven UI orchestration
