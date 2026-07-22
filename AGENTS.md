# Blixx DS — agent instructions

Shared guidance for AI coding agents (Cursor, Claude Code, and similar). Keep this file short; put long procedures in skills under `.claude/skills/` and `.cursor/skills/`.

## What this repo is

Multi-brand casino design-system POC: React 19 + Vite + TypeScript + Tailwind v4 + React Router + i18next + Storybook. Brands: `lonkero`, `kanuuna`, `fyffe`. HubHQ CMS at `/cms` (passcode `blixx`).

## Prerequisites

- **Node.js** 22+ (LTS)
- **npm** (lockfile is `package-lock.json` — prefer `npm ci` when the lockfile is present)

## First-time / “start me up”

If the user says **start me up**, **get me started**, **bootstrap**, **set up the project**, or similar, follow the **start-me-up** skill:

- Claude Code: `.claude/skills/start-me-up/SKILL.md` (also `/start-me-up`)
- Cursor: `.cursor/skills/start-me-up/SKILL.md`

Do not improvise a different install flow unless that skill fails.

## Everyday commands

| Command | Purpose |
| --- | --- |
| `npm ci` | Clean install from lockfile (preferred after clone) |
| `npm install` | Install / update deps when lockfile is missing or intentionally changing |
| `npm run dev` | App → http://localhost:5173 |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Preview production build |
| `npm run storybook` | Storybook → http://localhost:6006 |
| `npm run lint` | Oxlint |
| `npm run pages:deploy` | Build + Wrangler Pages deploy |

## Important URLs (local)

| Path | What |
| --- | --- |
| `/` | Welcome / casino shell |
| `/getting-started` | Post-setup success + command cheat sheet |
| `/docs` | Token / component docs |
| `/cms` | HubHQ (passcode `blixx`) |
| `/cms/assets` | HubHQ asset uploads (banners, tiles, brand icons) |

## GitHub & preview URLs

- Prefer **feature branches + PRs**; do not push casual experiments to `main`.
- **Testing URL without merging to `main`:** push the branch (or open a draft PR). Cloudflare Pages builds a preview — see [`README.md`](README.md#publish-a-testing-url-without-pushing-to-main).
- CLI preview (not production): `npm run build && npx wrangler pages deploy dist --project-name=blixx-ds --branch="$(git branch --show-current)"`
- Do not run a bare `wrangler pages deploy` (no `--branch`) for testing — that updates production.

## Conventions agents must respect

- Prefer existing UI primitives under `src/components/ui/` and brand tokens over one-off styles.
- Prefer **smooth, eased transitions** for show/hide and hover UI — see `.cursor/skills/frontend-design/SKILL.md` (also `.claude/skills/frontend-design/`).
- CMS publish must **never** write into `src/cms/factory/` (immutable factory defaults).
- Asset **binaries** live in Cloudflare R2 (or local `public/cms/uploads` during `npm run dev`); tenant JSON only stores URLs/metadata. Do not commit uploaded files.
- Icon chrome defaults are Lucide (`src/icons/iconRegistry.ts`); brand overrides use `BrandIcon`.
- Do not commit secrets (`.env`, credentials). Local upload secret defaults to HubHQ passcode `blixx` (override with `CMS_UPLOAD_SECRET`).
- Do not force-push or amend unless the user explicitly asks.
- Match existing TypeScript / React patterns; keep diffs focused.

## Further reading

- Human README: [`README.md`](README.md)
- GitHub workflow + preview URLs: [`README.md` — Using GitHub](README.md#using-github)
- Claude Code entry: [`CLAUDE.md`](CLAUDE.md)
- Factory defaults / CMS: [`README.md`](README.md#hubhq-cms-poc)
