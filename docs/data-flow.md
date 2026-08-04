# Data flow

**Read this before adding any API call.** The client has two different
mechanisms for server state and picking the wrong one is the most common way to
introduce a stale screen.

## The transport

One Socket.IO connection, opened by `WebsocketLayout`, stored on the main store.
Everything goes through `src/api/websocketServer.ts`:

```ts
asyncEmit<T>(ws, event, args): Promise<T>   // emit + await the ack, 15s timeout
useWebsocketApi()                            // { users, battle, guild, dungeons, … }
```

The timeout is not paranoia: a handler that throws where the server cannot
answer leaves the promise pending forever and the screen behind it loading
forever. Rejecting turns that into an error the caller can show.

A service is a thin wrapper, one file per feature in `api/services/`:

```ts
export function dungeonService({ websocket }: { websocket?: Socket }) {
  async function getAllDungeons() {
    if (!websocket) return undefined;
    return asyncEmit<Dungeon[]>(websocket, 'get_dungeons', '');
  }
  return { getAllDungeons };
}
```

Register it in `useWebsocketApi()` and it is available everywhere.

## Two mechanisms, and how to choose

### TanStack Query — for things you ask for

Use it when the client pulls data and the server will not volunteer changes:
the map list, the dungeon catalogue, the market page, the ranking.

- Keys come from the `Query` enum in `store/query.ts`. **Never inline a string.**
- App-wide queries are declared in `layout/Character/index.tsx`, gated on
  `!!store.websocket && store.wsAuthenticated`.
- Content that barely moves gets a long `staleTime` (10 minutes); live-ish data
  gets 60 seconds.
- Mutations use `useMutation` and are usually fire-and-forget — the server
  answers by pushing, not by returning the new state.

### Zustand — for things the server pushes

Use it when the server volunteers updates: the profile, the battle, the party,
the guild, the dungeon run.

`layout/Websocket/listeners.ts` maps each push straight onto a store setter.
**A component should read the store, not re-fetch.**

### The hybrid, and the trap

Some state is both: fetched once on load *and* pushed afterwards. The pattern is
a query whose `queryFn` writes the result into the store:

```ts
useQuery({
  queryKey: [Query.DUNGEON_STATUS],
  queryFn: async () => {
    const status = await api.dungeons.getDungeonStatus();
    userStore.setDungeonStatus(status);
    return status ?? null;
  },
});
```

**Read such state from the store, never from `getQueryState`** — the query holds
the first answer, the store holds the current one.

## The stores

| Store | Holds |
|---|---|
| `store/main.ts` | The socket, auth flag, login info, market listings, and UI filters (market page/category, inventory filter, ranking page) |
| `store/user.ts` | Everything about *me*: `user`, `party`, `partyStatus`, `guild`, `guildBoss`, `dungeonStatus`, `mailBox`, `notifications`, `purchases` |
| `store/battle.ts` | The current `battle`, skill-targeting state, and `cameFromDungeon` |
| `store/modal.ts` | One entry per modal — see [components.md](components.md) |
| `store/admin.ts`, `store/websocketLog.ts` | Admin panel, dev logger |

## Server payload types

Server entities are **global ambient types**, declared with `declare global` in
`src/api/types/*.ts` and never imported. `Dungeon`, `Battle`, `Monster`, `Item`,
`Guild`, `User` are all just… available.

- Entities → `api/types/`, request payloads → `api/dto/`.
- These are hand-written mirrors of the Prisma models. When the API changes a
  shape, update the mirror in the same change, and copy the *comments* too —
  they are where the non-obvious invariants live.

## Push events

Registered in `layout/Websocket/listeners.ts` (state) and `toastListener.tsx`
(toasts):

`user_update` · `battle_update` · `party_data` · `party_status` ·
`party_invite` · `guild` · `guild_boss` · `dungeon_status` · `mailbox` ·
`notifications` · `purchases` · `notification` · `error_notification`

Full contract: `../poring-adventure-api/docs/websocket-events.md`.

**`market_update` is also registered, but the server never emits it** — the
market page refreshes by invalidating its own query. Do not build on that
listener without wiring the server side first.

### `battle_update` does navigation

It is the one listener with routing logic, and the rules are load-bearing:

- A payload arrives and the player is not on `/battle` → navigate there. **This
  is how a party member is pulled into a fight someone else started.**
- `undefined` means the fight is over. The listener inspects the battle that was
  just cleared to decide where the player belongs: a guild boss sends them to
  `/guild?tab=boss`; a dungeon sets `cameFromDungeon` so the battle page opens
  its Dungeons tab instead of the map list.

## Errors

The server refuses by pushing `error_notification`, which the toast listener
renders. **A refusal is not a rejected promise** — most mutations resolve with
`false`. Do not build UI that waits for a throw.

Where the client can know a refusal in advance, it says so before the click
rather than after: `pages/battle/dungeon.ts` and `pages/guild/guildBoss.ts`
mirror the server's entry rules so the UI can name everyone blocking a run at
once, instead of surfacing them one failed attempt at a time.
