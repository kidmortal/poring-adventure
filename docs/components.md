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
