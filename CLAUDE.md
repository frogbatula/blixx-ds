# Claude Code — Blixx DS

Project instructions for Claude Code. Canonical shared guidance lives in [`AGENTS.md`](AGENTS.md) — read that first for stack, commands, and conventions.

## Quick triggers

| User says | Do this |
| --- | --- |
| `start me up` / get me started / bootstrap / set up | Load and follow [`.claude/skills/start-me-up/SKILL.md`](.claude/skills/start-me-up/SKILL.md) |
| CMS / Mission Control / factory restore | See `AGENTS.md` + `README.md` Mission Control section |

## Skills in this repo

Project skills are under `.claude/skills/`. Invoke with `/skill-name` or by matching the skill description.

| Skill | When |
| --- | --- |
| `start-me-up` | Fresh clone: install deps, run dev server, point user at `/getting-started` |

## Do not

- Skip `npm ci` / `npm install` when the user asked to start the project and `node_modules` is missing.
- Overwrite `src/cms/factory/` during publish workflows.
