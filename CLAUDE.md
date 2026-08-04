# Poring Adventure — client

Co-op RPG front end. **React 18 + Vite + TypeScript**, shipped as a web app and
as an Android app through Capacitor. **No HTTP API** — everything is one
Socket.IO connection.

The NestJS server is a sibling repository at `../poring-adventure-api`.

## Loading context — cheapest path first

1. **CodeGraph is indexed for this repo** (`.codegraph/` exists). For anything
   symbol-level — "where is X used", "show me Y", "what breaks if I change Z" —
   use it *before* grep or Read: `codegraph explore "<question>"`, or the
   `codegraph_explore` MCP tool.
2. **`docs/` answers how the pieces fit together**, which CodeGraph cannot. Open
   the one file that matches the task:

| Task | Read |
|---|---|
| Anything at all, first time in the repo | [docs/architecture.md](docs/architecture.md) |
| **Any API call, or displaying server state** | [docs/data-flow.md](docs/data-flow.md) |
| Finding a screen | [docs/pages-and-routes.md](docs/pages-and-routes.md) |
| Building UI, adding a modal | [docs/components.md](docs/components.md) |
| Writing SCSS | [docs/styling.md](docs/styling.md) |

The wire contract lives with the server:
`../poring-adventure-api/docs/websocket-events.md`.

## Conventions worth knowing before the first edit

- **Two mechanisms for server state, and picking wrong gives you a stale
  screen.** TanStack Query for things you ask for; Zustand for things the server
  pushes. Some state is both — read it from the store, not from the query.
  [docs/data-flow.md](docs/data-flow.md) has the rule.
- **Query keys come from the `Query` enum** in `store/query.ts`. Never inline a
  string.
- **Every modal is mounted once in `layout/Modal/index.tsx`** and opened by
  setting modal-store state. Never render one locally.
- **Server payload types are global ambient types** in `api/types/` — declared,
  never imported. They are hand-written mirrors of the Prisma models; update
  them, comments included, when the API changes shape.
- `<ForEach>` and `<When>` instead of `.map` and `&&`. `Switch` for two views,
  `Tabs` for three or more.
- SCSS modules only. `@import '@/styles/variables'` at the top of every one, and
  **never a raw hex** — the tokens and mixins are the design system.
- The app is locked to a phone-shaped frame (max 500×900) on every platform.
  Design for ~500px wide; there are no desktop breakpoints.

## Commands

```bash
yarn dev            # vite --host, port 3000
yarn build          # tsc && vite build
yarn lint           # eslint, --max-warnings 0
```

**There is no test suite here** — `tsc` and eslint are the whole safety net, so
both must be clean before anything is considered done.

## Keeping the docs true

**When you change how something works, update its `docs/` page in the same
commit.** These files are loaded automatically and believed; a stale one is
worse than none.

## Commit messages

Follow the [bee-stylish](https://github.com/BeeTech-global/bee-stylish/blob/master/commits/README.md)
convention. Every commit message uses this structure:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Subject line

- **Max 50 characters.**
- Type and scope in **lowercase**.
- **Imperative mood** — "add endpoint", not "added" or "adds".
- No trailing period.
- Scope is optional but preferred: the area touched (`market`, `profile`,
  `item-modal`, `types`, `deps`…).

Example: `feat(market): add category filter to listing page`

### Allowed types

| Type | Use for |
| --- | --- |
| `feat` | New functionality |
| `fix` | Bug fixes |
| `refactor` | Refactoring production code |
| `style` | Code formatting (not CSS/visual work) |
| `test` | Adding or refactoring tests |
| `docs` | Documentation |
| `chore` | Tasks and non-production code (build, deps, config) |

Note: `style` means *code formatting*. Visual/UI changes are `feat` (new UI) or
`fix` (broken layout), never `style`.

### Body

- Explain **what** changed and **why**, not **how** — the diff already shows how.
- **Wrap at 80 characters per line.**
- Include context a reader would otherwise have to reconstruct: the defect being
  fixed, the constraint driving the approach, anything surprising.
- Optional for small, self-evident commits.

### Footer

- Issue and pull request references: `Closes #123`, `Refs #456`.
- Co-author trailers go here.

### Language

English, matching this repository's existing history.

### One change per commit

Prefer several focused commits over one mixed commit. If a change spans types
(a fix plus a refactor), split it rather than picking one type for both.
