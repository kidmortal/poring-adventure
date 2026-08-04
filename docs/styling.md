# Styling

SCSS modules, one `style.module.scss` beside every component. No utility
framework, no CSS-in-JS. `classnames` (imported as `cn`) composes them.

```tsx
import cn from 'classnames';
import styles from './style.module.scss';

<div className={cn(styles.card, { [styles.running]: !!run })} />
```

## Always import the tokens

Every module starts with:

```scss
@import '@/styles/variables';
```

`src/styles/_variables.scss` is the whole design system. **Never write a raw
hex.** The theme is dark, fantasy/Ragnarok-flavoured: deep midnight blues with
gold trim.

### Tokens

| Group | Variables |
|---|---|
| Surfaces | `$dark-neutral` (backdrop) · `$neutral` (panels) · `$light-neutral` (app surface) · `$surface-raised` (slots, inputs) · `$surface-hover` |
| Accents | `$primary` · `$secondary` · `$success` · `$error` · `$orange` · `$gold` · `$gold-dim` |
| Vitals | `$hp` · `$mp` · `$exp` |
| Text | `$text` · `$text-muted` |
| Lines & depth | `$border` · `$border-strong` · `$shadow-panel` · `$shadow-raised` |
| Rarity | `$rarity-common` · `-uncommon` · `-rare` · `-epic` · `-legendary` · `-mythic` |
| Shape | `$radius-sm` (6px) · `$radius` (10px) · `$radius-lg` (14px) |

### Mixins

| Mixin | Use for |
|---|---|
| `panel($radius)` | The standard card: gradient, hairline border, depth. **Every card uses this.** |
| `panel-gold($radius)` | Hero surfaces — the header, the character card |
| `slot($radius)` | Inset cells — inventory, equipment, drop slots |
| `readable-text` | Text sitting on a coloured bar or a sprite |
| `tap-target($size)` | A comfortable touch target, default 40px |

## Conventions that hold across the codebase

- **`rem` for spacing, `px` for type and small fixed sizes.** Gaps cluster
  around `0.3–0.7rem`; the app is dense on purpose.
- Section headers are 10px, uppercase, `letter-spacing: 0.8px`, `$text-muted`.
- Numbers a player compares get `font-variant-numeric: tabular-nums`.
- Badges are `border-radius: 999px` with a translucent tinted background and a
  matching border — see `.badge` / `.bossBadge` in `pages/battle/components/`.
- Long names get `overflow-wrap: anywhere` or ellipsis. **Assume the narrowest
  phone.**
- Rarity and vital colours are never decorative. `$rarity-mythic` means a boss
  or the top rarity; `$orange` warns; `$error` refuses.

## The frame

`LimitedSizeLayout` constrains the whole app to a phone-shaped box —
`max-width: 500px`, `max-height: 900px` — centred on a vignette, on every
platform including desktop web.

**This is a mobile game rendered in a fixed frame.** There are no desktop
breakpoints and no media queries to add: design for ~500px wide and let scroll
containers handle overflow. Lists get `overflow-y: auto` on their own container
rather than growing the page.
