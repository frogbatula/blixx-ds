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

## Using GitHub

Repo: https://github.com/frogbatula/blixx-ds

Keep **`main`** for stable / shared work. Day-to-day changes go on a **feature branch**, then a **pull request (PR)** for review. You do **not** need to merge to `main` to get a public testing URL (see below).

### One-time: clone

```bash
git clone https://github.com/frogbatula/blixx-ds.git
cd blixx-ds
npm ci
npm run dev
```

### Everyday workflow

```bash
# 1. Start from up-to-date main
git checkout main
git pull origin main

# 2. Create a branch for your work
git checkout -b feat/short-description

# 3. Commit locally as you go
git add .
git commit -m "Describe why you changed something."

# 4. Push the branch (not main)
git push -u origin HEAD
```

Open a PR on GitHub (branch → `main`). Merge only when the team is ready for that work on the stable branch.

| Goal | Do this |
| --- | --- |
| Save work remotely | `git push` on your feature branch |
| Share a review link | Open a PR (even as draft) |
| Share a **live testing URL** | Push the branch / open a PR — Cloudflare builds a preview (next section) |
| Update `main` | Merge the PR on GitHub (or ask a maintainer) |

**Avoid:** committing straight to `main`, force-pushing (`--force`), or rewriting history on shared branches unless a maintainer asks you to.

## Publish a testing URL (without pushing to `main`)

Once the GitHub repo is connected to **Cloudflare Pages**, every **non-`main` branch** (and every PR) gets its own `*.pages.dev` preview. That is the normal way to share a test build.

### Option A — Preview from a branch / PR (recommended)

1. Push your feature branch: `git push -u origin HEAD`
2. Optionally open a **Draft PR** on GitHub (nice for comments; not required for the preview).
3. In [Cloudflare Dashboard → Workers & Pages](https://dash.cloudflare.com/) → project **blixx-ds** → **Deployments**, open the deployment for your branch.
4. Copy the **Preview** URL (something like `https://<hash>.blixx-ds.pages.dev` or a branch alias) and share it.

No merge to `main` required. Re-pushing the same branch updates that preview.

### Option B — Preview from your machine (CLI, still not `main`)

Use this when Git integration is not ready yet, or you want a one-off deploy from local files:

```bash
npm run build
npx wrangler pages deploy dist --project-name=blixx-ds --branch="$(git branch --show-current)"
```

- `--branch=…` tags the deploy as a **preview** for that branch name (not production/`main`).
- You need Wrangler logged in (`npx wrangler login`) and access to the Pages project.
- Prefer Option A once Git → Cloudflare is connected, so CI builds what is on GitHub.

### First-time: connect GitHub → Cloudflare Pages

Only needed once per team / project:

1. Push this repo to GitHub (already at `frogbatula/blixx-ds`).
2. [Cloudflare Dashboard → Workers & Pages](https://dash.cloudflare.com/) → **Create** → **Pages** → **Connect to Git**.
3. Build settings:

   - **Framework preset:** Vite
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Node version:** 22 (or latest LTS)

4. Production URL tracks **`main`**. Branch / PR pushes get separate preview URLs.

### Production deploy from CLI (uses production slot — avoid for casual testing)

```bash
npm run build
npx wrangler pages deploy dist --project-name=blixx-ds
```

Without `--branch`, this updates the **production** deployment. For testing, use Option A or Option B with `--branch`.

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
