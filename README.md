# marcOS — Interactive macOS Portfolio

> An Angular 21 portfolio that looks and feels like a real macOS desktop.

---

## What is this?

marcOS replaces the traditional static portfolio with a fully interactive desktop environment. Every application in the dock reveals a different facet of the developer's background — just like apps on a real Mac.

Recruiters and visitors navigate a familiar macOS interface: they open the **Finder** to browse files, launch the **Terminal** to run commands, flip through **Projects**, read the **Resume**, listen to **Music**, and send a message through the **Mail** app. The experience is built to be memorable, explorable, and technically impressive on its own.

---

## Features at a glance

| App / Feature | Description |
|---|---|
| **Desktop** | Draggable windows, wallpaper selection, desktop icons |
| **Dock** | macOS-style app launcher with hover magnification |
| **Top Bar** | Functional menus (File, View, Go, Window…), Wi-Fi easter egg, volume slider, language switch |
| **Finder** | Collapsible file tree showing the project structure |
| **Terminal** | Functional shell with custom commands (`help`, `ls`, `whoami`, `clear`, …) |
| **Projects** | Filterable project grid with technology tags |
| **Photos** | Image gallery with wallpaper-from-photo support |
| **Resume** | Tabbed CV (Experience / Education) in a draggable window |
| **Skills** | Animated skill bars across Frontend, Backend, and DevOps |
| **Music** | In-app YouTube player with a curated playlist |
| **Mail** | Contact form powered by EmailJS |
| **Settings** | Light/Dark mode toggle, wallpaper picker, language, sound controls |
| **Command Palette** | Spotlight-like search (⌘K / Ctrl+K) |
| **System Sounds** | Boot chime, window open/close, click, right-click sounds via Web Audio API |
| **Notifications** | macOS-style toast alerts triggered contextually |
| **About** | Version info and project credits |

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Angular 21 — standalone components, signals, `inject()` |
| UI components | PrimeNG 21 |
| Styling | Tailwind CSS 3, PrimeUI Tailwind preset |
| i18n | `@ngx-translate/core` — French & English |
| Email | EmailJS (`@emailjs/browser`) |
| Testing | Vitest 4 with jsdom |
| Build | Angular CLI 21, esbuild |
| Language | TypeScript 5.9, strict mode |

---

## Getting started

### Prerequisites

- Node.js ≥ 20
- npm ≥ 10

### Install

```bash
git clone https://github.com/mamugg/marcos-portfolio.git
cd marcos-portfolio
npm install
```

### Run locally

```bash
npm start
# → http://localhost:4200
```

### Build for production

```bash
npm run build
# Output in dist/
```

### Run tests

```bash
npm test              # run all unit tests
npm run test:coverage # generate coverage report
npm run test:ui       # open Vitest UI
```

### Lint & format

```bash
npm run lint          # ESLint check
npm run format        # Prettier auto-format
```

---

## Project structure

```
src/
├── app/
│   ├── features/             # One folder per app window
│   │   ├── about/            # About dialog
│   │   ├── dock/
│   │   │   ├── components/   # Desktop, Dock, Finder, Terminal, Top Bar, …
│   │   │   └── services/     # DockStateService, DockMenuService
│   │   ├── mail/             # Contact form
│   │   ├── music/            # Music player
│   │   ├── projects/         # Projects grid
│   │   ├── resume/           # CV dialog
│   │   ├── settings/         # System preferences
│   │   ├── skills/           # Skills dialog
│   │   └── welcome/          # First-visit welcome dialog
│   └── shared/
│       ├── components/       # CommandPalette, ThemeSwitcher, NotFound
│       ├── models/           # TypeScript interfaces (index.ts)
│       └── services/         # ErrorService, SoundService, StorageService, …
├── assets/
│   └── i18n/                 # fr.json, en.json
└── public/
    └── icons/                # SVG app icons
```

### Key services

| Service | Role |
|---|---|
| `DockStateService` | Central signal store — controls which window is open |
| `DockMenuService` | Builds the dock and top-bar menu items |
| `ThemeService` | Light/dark toggle, synced with localStorage |
| `SoundService` | Web Audio API sounds: boot, shutdown, open, close, click, menu |
| `SoundEffectsService` | Watches `DockStateService` signals and triggers sounds automatically |
| `StorageService` | Typed localStorage wrapper with `marcOS_` prefix |
| `ErrorService` | Centralized PrimeNG toast error display |

---

## Architecture — how windows work

Every UI panel follows the same pattern:

1. A `signal` in `DockStateService` (e.g. `displayFinder`)
2. A toggle helper (`toggleFinder()`) called from the dock or menus
3. A standalone dialog component rendered in `DockWindowComponent`

Adding a new "app" means adding a signal to `DockStateService`, a menu entry in `DockMenuService`, and a component in `DockWindowComponent`. The rest (sounds, close-all, command palette) picks it up automatically.

---

## Keyboard shortcuts

| Shortcut | Action |
|---|---|
| `⌘K` / `Ctrl+K` | Open Command Palette |
| `↑` / `↓` | Navigate Command Palette |
| `↵` | Confirm Command Palette selection |
| `Esc` | Close Command Palette / active dialog |

---

## Internationalisation

The app ships in **French** and **English**. The active language is stored in localStorage and can be switched from the Control Center in the top bar or from Settings → General.

Translation files live in `src/assets/i18n/fr.json` and `src/assets/i18n/en.json`. Every user-visible string must have an entry in both files — no hardcoded text in templates or services.

---

## Customisation

### Wallpapers

Wallpapers are defined in `SettingsDialogComponent` as Tailwind/CSS background values. Add a new entry to the `wallpapers` array and optionally add a preview thumbnail in `public/`.

### Projects

Projects data lives in `ProjectsDialogComponent`. Each project has a name, description, list of technologies, and an optional `featured` flag.

### Resume & Skills

Content is driven by i18n keys (`resume.*`, `skills.*`) so updating it means editing `fr.json` and `en.json` — no component changes required.

---

## License

MIT — feel free to fork and adapt for your own portfolio, but please don't present Marc-Antoine's personal content as your own.
