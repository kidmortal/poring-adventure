# Poring Adventure client — reference docs

Written to be **read by an agent starting cold**. Each file answers "how does
this work and where does it live", so a session can load one file instead of
reading a dozen components to rebuild the same picture.

## How to use these

1. **`CLAUDE.md` at the repo root** is loaded automatically and points at the
   right file for the task. Start there.
2. **Open one file, not the folder.**
3. **For symbol-level questions — "where is X used", "show me Y's source" — use
   CodeGraph instead** (`codegraph explore "<question>"`, or the
   `codegraph_explore` MCP tool). It is indexed for this repo and is cheaper and
   more current than prose. These docs cover what it cannot: how the pieces fit
   together and why.

## The files

| File | Read it when |
|---|---|
| [architecture.md](architecture.md) | Adding a route, a layout, or anything about the build and the mobile wrapper |
| [data-flow.md](data-flow.md) | Fetching or displaying server state — **read this before adding any API call** |
| [pages-and-routes.md](pages-and-routes.md) | You need to find where a screen lives |
| [components.md](components.md) | Building UI — shared primitives, modals, stat displays |
| [styling.md](styling.md) | Writing SCSS: theme tokens, mixins, the mobile-first constraints |

## The server

The NestJS API lives in a sibling repository at `../poring-adventure-api`, with
its own `docs/` folder. The two talk over websockets only — the contract is
`../poring-adventure-api/docs/websocket-events.md`, and that repo's
`docs/data-model.md` explains what the payloads mean.

## Keeping these current

A change and its doc update belong in the same commit. A doc that lies is worse
than no doc: it is loaded automatically and believed.
