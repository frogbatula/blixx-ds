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
npm install
npm run dev
```

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

## Project layout

```
src/
  app/           # layout, providers, locale sync
  brands/        # per-brand theme CSS (default|alt × dark|light)
  components/ui/ # Button, Card, Input, Badge, Separator
  components/navigation/
  i18n/
  mock/
  pages/
  styles/globals.css
```

## License

Private / internal POC.
