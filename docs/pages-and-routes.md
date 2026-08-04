# Pages and routes

Declared in `src/router.tsx`. Every game route sits inside the full layout chain
described in [architecture.md](architecture.md), so a page can assume an
authenticated socket and a loaded character.

| Route | Page | What it is |
|---|---|---|
| `/login` | `pages/login` | Google sign-in. The only route outside `WebsocketLayout`. |
| `/create` | `pages/characterCreation` | Class, head and costume picker. Also rendered by `CharacterLayout` when the account has no character. |
| `/` and `/profile` | `pages/profile` | Character sheet and trades, switched by a `Switch`: `UserProfile` (stats, equipment, inventory, skills) / `UserProfession` (gathering, crafting, hiring, commissions). |
| `/battle` | `pages/battle` | Fighting. Tabs **Maps** and **Dungeons** when idle, the fight itself when there is one. |
| `/party` | `pages/party` | `PartyInfo` (your party and chat) / `PartyList` (open parties to join). |
| `/guild` | `pages/guild` | Tabs: Overview, Boss, Members, Requests. Accepts `?tab=boss`, which is where a guild boss fight returns you. |
| `/guildstore` | `pages/guildstore` | The guild-token shelf. |
| `/market` | `pages/market` | Paginated player listings with a category filter. |
| `/store` | `pages/store` | Real-money products (`availableProducts`) and claiming past purchases (`purchasedProducts`). |
| `/ranking` | `pages/ranking` | Tabs: `players` / `guilds`, both paginated. |
| `/admin` | `pages/admin` | Behind `AdminLayout`. Live-ops buttons, connected users, server info. |
| `*` | | Falls back to the profile page. |

## Page conventions

- **One folder per page**, `index.tsx` + `style.module.scss`. Sub-views and
  page-local components live in the same folder (`components/`, or a named
  folder like `UserProfile/`).
- **Page-local pure logic goes in a sibling `.ts` file**, not inside the
  component: `pages/battle/dungeon.ts` and `pages/guild/guildBoss.ts` hold the
  entry rules the UI mirrors from the server. Keep that pattern — it is the only
  client logic worth reading twice.
- **Two views → `Switch`. Three or more → `Tabs`.** Both are in
  `components/shared`.
- Pagination state lives in the main store (`marketFilters.page`,
  `rankingPage`), not in component state, so it survives a remount.

## The battle page

Worth describing because it is the most stateful screen.

```
pages/battle/
  index.tsx              picks: active battle, or the Maps/Dungeons tabs
  dungeon.ts             pure: entries, blockers, stage state, level range
  components/
    MapSelection   MapInfo          the map list and one map card
    DungeonSelection  DungeonInfo   the dungeon list and one dungeon card
    BossPath                        the three bosses joined by the path line
    ActiveBattle                    the fight
    TurnOrder  BattleMonsterInfo  BattleActions  BattleLogs
    BattleResults  BattleRewardsBox
```

`ActiveBattle` hands over to `BattleResults` as soon as `battle.battleFinished`
is set — a finished fight is a report, not an arena.

`BattleResults` branches on `battle.dungeon`: a dungeon run offers "Next boss"
and "Leave the dungeon" (leaving forfeits the run), everything else offers
"Fight again" and "Back to maps".
