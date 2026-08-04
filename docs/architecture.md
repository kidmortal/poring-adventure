# Architecture

React 18 + TypeScript, built by Vite, shipped both as a web app (Netlify) and as
an Android app through Capacitor. **There is no HTTP API** — everything comes
over one Socket.IO connection.

## Stack

| Concern | Choice |
|---|---|
| Build | Vite 5, `@` aliased to `src/` |
| Routing | react-router-dom 6 |
| Server state | TanStack Query 5 (fetch-once) + Zustand (push updates) |
| Transport | socket.io-client |
| Styling | SCSS modules + `classnames` |
| Auth | Firebase (web SDK on the browser, `@capacitor-firebase/authentication` on Android) |
| Mobile | Capacitor 5 — screen orientation, app update, RevenueCat purchases, OneSignal push |
| Icons | react-icons (`Fa*` throughout) |
| Toasts | react-toastify |

## Layout

```
src/
  api/
    websocketServer.ts   asyncEmit + useWebsocketApi() — the single entry point
    services/            one file per feature, thin emit wrappers
    types/               global `declare global` server entity types
    dto/                 global request payload types
  auth/ config/          Firebase setup
  components/            reusable UI (see components.md)
  hooks/                 useAuth, usePagination, useDetectClickOutsideElement
  layout/                nested route layouts (see below)
  modals/                every modal, driven by the modal store
  pages/                 one folder per route
  screens/               full-screen states (disconnected, update available)
  store/                 Zustand stores + the Query key enum
  styles/                _variables.scss (theme tokens + mixins), global.scss
  types/                 non-server-payload types (ui.ts)
```

## The layout chain

`router.tsx` nests layouts, and **the order is the app's startup sequence**.
Every game route sits at the bottom of all of it:

```
LimitedSizeLayout    phone-width frame; Capacitor init (orientation,
                     RevenueCat, version check)
  AuthLayout         Firebase session; redirects to /login
    WebsocketLayout  opens the socket, registers every listener,
                     shows the disconnected / reconnecting screens
      PageLoadingLayout
        CharacterLayout   fires the app-wide queries, renders the header
                          and bottom nav; shows character creation when the
                          account has no character yet
          ModalLayout     mounts every modal once
            <page>
          GuildLayout     /guild, /guildstore
          AdminLayout     /admin
```

Consequences worth knowing:

- **A page can assume it has an authenticated socket and a loaded character.**
  Everything above it has already gated on that.
- **`CharacterLayout` is where app-wide queries are declared** — profile,
  battle, maps, dungeons, dungeon status, mailbox, notifications. Add a new
  always-needed query there, not in a page.
- **`ModalLayout` mounts every modal**, always. A modal is opened by setting
  state in the modal store, never by rendering it locally.
- `WebsocketLayout` registers listeners in a `useEffect` keyed on the socket, so
  a reconnect re-registers them.

## Build and run

```bash
yarn dev            # vite --host, port 3000
yarn build          # tsc && vite build (+ the Netlify _redirects file)
yarn lint           # eslint, --max-warnings 0
yarn build:all      # web build + capacitor sync + android build
```

`VITE_API_URL` points at the API.

There is **no test suite** in this repository; `tsc` and eslint are the whole
safety net, so both must be clean.

## Mobile specifics

`Capacitor.getPlatform() === 'android'` branches exist in `useAuth` (native
Firebase plugin instead of the web SDK) and in `LimitedSizeLayout` (orientation
lock, RevenueCat configuration, version check). Anything touching auth,
purchases or device APIs needs both paths considered.
