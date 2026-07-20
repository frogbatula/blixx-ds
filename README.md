# Blixx DS — Casino design-system POC

Multi-brand React + Vite + Tailwind v4 prototype for **Lonkero**, **Kanuuna**, and **Fyffe**, with theme schemes, light/dark modes, country/language switching, Storybook, and Cloudflare Pages previews.

Tokens are seeded from the [Blixx DS Figma colours](https://www.figma.com/design/7RDfjTBZGkOyqiw0h4OLuz/Blixx-DS-V0.1-TailwindCSS-v4.1.6?node-id=888-20695) (accents deferred).

## Stack

- React 19 + TypeScript + Vite
- Tailwind CSS v4 (`@tailwindcss/vite`)
- shadcn-inspired UI (`cva`, Radix Slot/Label/Separator)
- React Router, i18next (`fi` / `en` / `sv`)
- Storybook 10
- Cloudflare Pages

## Quick start

```bash
npm ci   # or: npm install
npm run dev
```

Then open http://localhost:5173/getting-started for a short success page and command cheat sheet.

### AI-assisted start (“start me up”)

Clone the repo, open it in Cursor or Claude Code, and say **start me up** (or `/start-me-up`). Agent instructions live in [`AGENTS.md`](AGENTS.md) / [`CLAUDE.md`](CLAUDE.md); the workflow skill is duplicated for both editors:

- [`.claude/skills/start-me-up/`](.claude/skills/start-me-up/)
- [`.cursor/skills/start-me-up/`](.cursor/skills/start-me-up/)

Requires **Node.js 22+**.

| Script | Description |
| --- | --- |
| `npm run dev` | App at http://localhost:5173 |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Preview production build |
| `npm run storybook` | Storybook at http://localhost:6006 |
| `npm run build-storybook` | Static Storybook → `storybook-static/` |

## Brands & theming

Preferences live on `<html>` as `data-brand`, `data-theme`, and `class="dark|light"`, and persist in `localStorage`.

| Brand | Themes | Modes |
| --- | --- | --- |
| `kanuuna` | `default`, `alt` | `dark`, `light` |
| `lonkero` | `default`, `alt` | `dark`, `light` |
| `fyffe` | `default`, `alt` | `dark`, `light` |

- **Desktop:** left sidebar (≥ 1280px / `xl`)
- **Mobile:** bottom icon nav (&lt; 1280px)

POC controls on the Welcome page (and sidebar footer) switch brand, theme, color mode, country (`FI` / `SE` / `GB`), and locale (`fi-FI` / `en-GB` / `sv-SE`).

## Storybook

Toolbar globals switch brand / theme / color mode for component stories.

```bash
npm run storybook
```

## Cloudflare Pages (preview URLs)

### Connect GitHub

1. Push this repo to GitHub.
2. In [Cloudflare Dashboard → Workers & Pages](https://dash.cloudflare.com/) → **Create** → **Pages** → **Connect to Git**.
3. Build settings:

   - **Framework preset:** Vite
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Node version:** 22 (or latest LTS)

4. Each push to a branch / PR gets a `*.pages.dev` preview URL.

### Deploy from CLI

```bash
npm run build
npx wrangler pages deploy dist --project-name=blixx-ds
```

### Optional: Storybook on Pages

Create a second Pages project (e.g. `blixx-ds-storybook`) with:

- **Build command:** `npm run build-storybook`
- **Output directory:** `storybook-static`

## Mission Control (CMS POC)

In-app content CMS for the Content team — multi-tenant inheritance without a database for this POC.

- **URL:** http://localhost:5173/cms
- **Passcode:** `blixx`
- **Also:** Debug menu gear → Mission Control

| Area | What it does |
| --- | --- |
| Copy | Edit locale keys with tenant → brand → country → language inheritance |
| Design tokens | Override semantic tokens per brand / theme / light-dark |
| Publish | Download flat locale JSON (and token CSS) for the site |

Source of truth for edits: [`cms/data/happymoney.json`](cms/data/happymoney.json) (working seed). Drafts save to `localStorage`.

**Factory defaults (safety net):** [`src/cms/factory/`](src/cms/factory/) is an immutable backup of locales + tenant JSON. Publish never writes there. The live app always merges factory under `src/i18n/locales`, so missing keys still resolve. In Mission Control, **Restore factory defaults** clears the draft, reloads the factory tenant, resets runtime copy, and (with local `npm run dev`) copies factory files back onto disk.

**Publish flow (POC):**

1. Edit copy/tokens in Mission Control  
2. **Publish now** — saves draft, applies strings to the running app, and (with local `npm run dev`) merges into `src/i18n/locales/*.json` + updates working seed JSON (not factory)  
3. **Export** (optional) — download JSON for git/CI when you’re on Cloudflare Pages or another host without the local write API  

Production later: same inheritance model, but step 2 writes to a database and CI exports flat files.

## Project layout

```
cms/data/           # working tenant seed (publishable)
src/
  app/              # layout, providers, locale sync
  brands/           # per-brand theme CSS (default|alt × dark|light)
  cms/
    factory/        # immutable backup defaults (never overwritten by publish)
    seed/           # last published working copy
  components/ui/    # Button, Card, Input, Badge, Separator
  components/navigation/
  i18n/
  mock/
  pages/            # includes GettingStartedPage at /getting-started
  styles/globals.css
AGENTS.md           # shared AI agent instructions (Cursor + others)
CLAUDE.md           # Claude Code entrypoint → AGENTS.md + skills
.claude/skills/     # Claude Code skills (e.g. start-me-up)
.cursor/skills/     # Cursor skills (mirrored)
```

## License

Private / internal POC.
