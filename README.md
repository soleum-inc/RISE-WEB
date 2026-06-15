# RISE Marketplace Web Admin

Administrative console for the RISE / LOB community marketplace — a tool for
community managers to manage members, projects, events, case management, and
content. Built as a single-page React app.

> **Status:** internal product. The code is public for reference/collaboration,
> but it is proprietary — see [License](#license).

## Tech stack

- **React 18** + **TypeScript**
- **Vite 6** (dev server + build)
- **Tailwind CSS v4** (design tokens via `@theme`)
- **shadcn/ui** components on **Radix UI** primitives
- **Phosphor Icons** (`@phosphor-icons/react`)
- **React Router 7** (route-based code splitting)
- **Recharts** for charts

## Design system

The look is intentionally minimal and high-quality. Tokens live in
[`src/styles/theme.css`](src/styles/theme.css):

- **Typography:** Barlow — **Bold** headings, Regular body (loaded via Google
  Fonts in `index.html`, wired to `--font-sans`).
- **Color:** a neutral light-gray canvas with white cards. Colour is used
  sparingly: the `#335FFF` **brand ramp** appears only in the soft header wash,
  focus/selection rings, and the subtle active-nav state. **Black** is the
  primary action colour. Green / amber / red are reserved for genuine **status**.
- **Surfaces:** 16px card radius, very soft shadow scale, hairline borders.
- **Motion:** lightweight route transitions via `tw-animate-css`; honours
  `prefers-reduced-motion`.

Reusable building blocks live in `src/app/components/ui/`, including
`StatCard` (metric tile, neutral by default) and `StatusBadge` (status pill),
alongside the shadcn primitives.

## Getting started

**Prerequisites:** Node.js 18+ (20+ recommended).

```bash
# install dependencies
npm install

# start the dev server (http://localhost:5173)
npm run dev

# production build into dist/
npm run build

# preview the production build (http://localhost:4321)
npm run preview
```

> A `package-lock.json` is committed, so `npm` is the supported package manager.

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server with HMR. |
| `npm run build` | Build the optimized production bundle to `dist/`. |
| `npm run preview` | Serve the built `dist/` locally. |

## Project structure

```
src/
  main.tsx                 # app entry
  styles/                  # theme.css (tokens), fonts.css, tailwind.css, index.css
  app/
    App.tsx                # shell + router (lazy-loaded routes)
    components/
      SideNav.tsx          # left navigation
      TopBar.tsx           # floating top controls
      ui/                  # shadcn primitives + StatCard, StatusBadge
      settings/            # settings sub-panels
    context/               # FrameworkContext (ASSA/BIAS mode toggle)
    data/mockData.ts       # sample data
    pages/                 # Dashboard, MembersList, MemberDetail, CaseManagement,
                           # Events, CommunityFeed, ModuleBuilderNew,
                           # PathwayPreview, Settings
```

### Routes

`/dashboard` · `/members` · `/members/:id` · `/members/case-management` ·
`/events` · `/community-feed` · `/resources/modules` · `/resources/pathway` ·
`/settings`

## Notes

- The app uses **mock data** (`src/app/data/mockData.ts`) — there is no backend
  wired up yet.
- Pages are **lazy-loaded** per route to keep the initial bundle small; heavy
  dependencies (e.g. Recharts) load only on the pages that use them.

## License

**Proprietary — © 2026 Soleum. All rights reserved.** See [LICENSE](LICENSE).
Third-party components are licensed separately; see
[ATTRIBUTIONS.md](ATTRIBUTIONS.md).
