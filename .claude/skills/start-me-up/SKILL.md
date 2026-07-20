---
name: start-me-up
description: >-
  Install dependencies and launch the Blixx DS local app. Use when the user
  says "start me up", "get me started", "bootstrap", "set up the project",
  "install and run", or asks to download dependencies and launch after cloning.
---

# Start me up

Bootstrap a fresh clone of **blixx-ds** so the app is running and the user lands on the success page.

## Checklist

Copy and track:

```
Start me up:
- [ ] Node 22+ available
- [ ] Dependencies installed (`npm ci` or `npm install`)
- [ ] Dev server running (`npm run dev`)
- [ ] User pointed to http://localhost:5173/getting-started
```

## Steps

### 1. Confirm Node

```bash
node -v
```

Require **v22+**. If missing or too old, tell the user to install Node 22 LTS from https://nodejs.org/ and stop until they have it.

### 2. Install dependencies

From the repo root:

```bash
# Prefer lockfile-faithful install after clone
npm ci
```

If `npm ci` fails because `package-lock.json` is missing or out of sync, fall back to:

```bash
npm install
```

Do **not** change `package.json` / lockfile unless install fails for a real dependency reason and the user wants a fix.

### 3. Launch the app

Start the Vite dev server in the background (do not block the session on it):

```bash
npm run dev
```

Wait until the server prints a local URL (default **http://localhost:5173**). If the port is taken, use the URL Vite prints.

### 4. Confirm success to the user

Tell them clearly:

1. **You’re up** — open **http://localhost:5173/getting-started** (success + command cheat sheet).
2. Casino shell: http://localhost:5173
3. Storybook (optional, separate process): `npm run storybook` → http://localhost:6006
4. Mission Control: http://localhost:5173/cms — passcode `blixx`

Keep the reply short. Point them at `/getting-started` rather than pasting the whole cheat sheet into chat.

## Failure handling

| Problem | Action |
| --- | --- |
| No Node / wrong version | Stop; give Node 22 install link |
| `npm ci` EUSAGE / lock mismatch | Retry with `npm install`; report if still failing |
| Port 5173 in use | Use Vite’s alternate URL, or ask before killing the other process |
| Network / registry errors | Show the error; suggest retry or corporate registry fix |

## Out of scope

- Do not deploy to Cloudflare as part of this skill.
- Do not run Storybook unless the user asks.
- Do not commit, push, or open PRs.
