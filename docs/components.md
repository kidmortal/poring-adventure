# Components

Three tiers: shared primitives, domain components, and modals.

## Shared primitives — `components/shared/`

| Component | Notes |
|---|---|
| `Button` | `label` is a `ReactNode`, so an icon + text span is the normal way to build one. `theme` comes from `Theme` in `types/ui.ts`: `primary` (default), `secondary`, `danger`, `success`, `gold`, `neutral`. |
| `IconButton` | |
| `Input` | |
| `Tabs` | Segmented control. **Three or more views.** Generic over the tab union; options carry an optional numeric `badge`. |
| `Switch` | **Exactly two views.** `leftLabel` / `rightLabel`. |
| `ForEach` | `<ForEach items={xs} render={(x) => …} />` — tolerates `undefined`, which is why it is used instead of `xs?.map`. |
| `When` | `<When value={cond}>…</When>` — conditional rendering without `&&` returning `0`. |
| `LoadingBlock` | Inline "still loading" block, with an `info` label. |
| `Pagination` | Pairs with `hooks/usePagination.ts`. |
| `Tooltip` | |

`ForEach` and `When` are used pervasively. Match them rather than introducing
`.map` and `&&`.

## Domain components

**`components/Character/`**
`CharacterInfo` (and `CharacterHead`, the isolated portrait used in member and
blocker lists) · `CharacterPose` · `CharacterStatsInfo` ·
`CharacterSummaryHeader` (the app header) · `CharacterWithHealthBar` (the battle
and party representation).

**`components/StatsComponents/`** — every number a player reads.
`Silver` (abbreviates unless `exact`) · `GuildToken` · `HealthBar` · `ManaBar` ·
`ExperienceBar` · `StatBar` · `BuffList` · `ExpStack` · `SilverStack` ·
`ResourceStack`.

**Use these rather than formatting a number inline** — they carry the icon and
the abbreviation rules.

**`components/Items/`**
`Inventory` · `InventoryItem` (quality border, enhancement suffix, stack count) ·
`Equipments` · `ItemStats` · `ItemCategoryFilter`.

**`components/Monsters/`**
`MonsterChip` (sprite, name, level; bosses highlighted) and `levelRange`.

**Others**
`GuildTaskInfo` · `InviteBox` (rendered inside a toast) · `ErrorMessage` ·
`GoogeLoginButton` · `WebsocketDebugPanel` (rides along on every screen,
including failed connections — that is when the log matters most).

The debug panel renders for **any dev build, and for an admin in production** —
live operations needs the frame log and the battle tools on the server people
actually play on. Hiding it from everyone else is a matter of clutter, not of
trust: every admin event it sends goes through `AdminGuard` server-side.

Two tabs:

- **log** — the websocket frame log, filterable by direction and searchable.
  `devLogger.ts` records on every build, because the admin flag arrives several
  frames after connect and the connection attempt is the part worth having.
  The launcher is **held for a second to pick up**, then dragged anywhere and
  dropped; the spot is remembered in `localStorage`. A plain drag would fight
  every tap, so the hold is what separates moving it from using it, and moving
  early cancels the hold. The whole panel is rendered through a **portal onto
  `document.body`** — the device preview scales the app's frame, and a
  transformed ancestor would turn its `position: fixed` into something anchored
  inside the phone it is meant to be driving.

- **tools** (`DevTools.tsx`) — jumps to `/create` so character creation can be
  looked at *without deleting your character* (it is a real route outside
  `CharacterLayout`, and the server refuses a second character for the account,
  so it is a preview), openers for every modal that needs no argument, the
  query-cache buttons, and the session's socket id, character and route. Admins
  also get a Battle section — `kill_battle_monsters` drops everything standing
  in your own fight and settles it as a win (drops, rewards, dungeon stage and
  all), and `force_end_battle` throws the fight away.

### Device preview

The Screen section puts the app in a simulated phone: `store/devicePreview.ts`
holds the chosen `DevicePreset`, and `LimitedSizeLayout` sizes its frame to it
and scales the result to fit the window (`hooks/useFitScale.ts`, downwards only
— blowing a 280px screen up to fill a monitor flatters the layout instead of
testing it).

Three things are simulated because they are the three that actually break a
mobile layout, and none of them can be seen by making a desktop window narrow:

- **Size in CSS pixels**, not marketing resolution — a phone's advertised width
  is its physical pixels and is two or three times what the layout sees.
- **The address bar** (`chrome`), which is the whole difference between `100vh`
  and `100dvh`. Toggling it is how you catch a bottom row that disappears when
  the bar slides back in.
- **Browser text zoom**, applied the way a browser applies it: the viewport gets
  *narrower* in CSS pixels and is painted back up to size, rather than the text
  simply growing. That is why zoom, not screen size, is where overflow shows up
  first — at 150% a 390px phone is a 260px one.

`safeTop` / `safeBottom` pad the frame for the notch and the home indicator.

## Modals

**Every modal is mounted once, in `layout/Modal/index.tsx`, and opened by
setting state in `store/modal.ts`.** Never render a modal locally.

Adding one:

1. `modals/<Name>Modal/index.tsx`, wrapping `BaseModal` and taking
   `{ isOpen, onRequestClose, …data }`.
2. A state type and a `x` / `setX` pair in `store/modal.ts`.
3. Mount it in `layout/Modal/index.tsx`.
4. Open it from anywhere: `modalStore.setDungeonBoss({ open: true, monster })`.

Note the two setter styles already in the store: most replace
(`set(() => ({ x: v }))`), a few merge (`set((s) => ({ x: { ...s.x, ...v } }))`)
so a caller can update one field. Merging is for modals whose state is edited
while open, like `sellItem`'s amount and price.

### Chaining modals

A modal that opens another **closes itself first** — two stacked sheets hide the
thing you tapped. `MonsterInfoModal` and `DungeonBossModal` both do this when a
drop is tapped:

```ts
onRequestClose();
modalStore.setItemInfo({ open: true, item: drop.item });
```

### The roster

`BaseModal` · `ConfirmationModal` · `ItemMenuModal` · `ItemInfoModal` ·
`SellItemModal` · `BuyItemModal` · `EnhanceItemModal` · `CraftDetailsModal` ·
`SwapProfessionModal` · `MonsterInfoModal` · `DungeonBossModal` ·
`SkillbookModal` · `SkillInfoModal` · `MailBoxModal` · `GiftModal` · `FriendListModal` ·
`InteractUserModal` · `PartyMemberModal` · `GuildInfoModal` ·
`GuildMemberModal` · `GuildTaskSelectModal` · `GuildBossSummonModal` ·
`GuildBlessingModal` · `UserSettingsModal` · `UserEditCharacterModal` ·
`DeleteCharConfirmation` · `DiscordIntegrationModal`

## Constants

`src/constants.ts` holds `ITEM_QUALITY` (indexed by the numeric quality the API
sends) and `ITEM_CATEGORIES`. Use them rather than re-deriving quality names.
