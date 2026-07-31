# Poring Adventure

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
