---
name: frontend-design
description: >-
  Blixx DS UI motion and interaction polish. Use when building or changing
  components, hover states, overlays, page transitions, or any visual
  show/hide behavior in the design system.
---

# Frontend design — motion

## General rule

Always prefer **smooth animations for transitions with a little easing** rather than flicker on and off.

Show/hide, hover overlays, panels, menus, toasts, and state changes should ease in and out — not pop instantly.

## Defaults to use

| Concern | Prefer |
| --- | --- |
| Duration | `200–400ms` for micro UI (hovers, overlays); game tile overlays use `400ms` |
| Easing | Prefer `ease-in` for overlay fades; `ease-out` / `ease-in-out` also fine when it fits |
| Properties | Prefer `opacity` and `visibility` for fades; avoid slide/transform on overlay exit unless intentional |
| Reduced motion | Honor `motion-reduce:transition-none` (or equivalent) |

### Tailwind starter

```txt
transition-[opacity,visibility] duration-400 ease-in motion-reduce:transition-none
opacity-0 invisible
group-hover:opacity-100 group-hover:visible
```

Pair opacity fades with `visibility` (or delayed pointer-events) so the fade-out can finish before the layer stops receiving events. Do not add downward/slide motion on hover overlay leave — a simple fade out is enough.

## Do

- Fade / ease hover overlays (e.g. game tile Demo / Play actions)
- Ease open/close for sheets, dialogs, dropdowns, and popovers when customizing
- Keep motion subtle — presence and hierarchy, not noise

## Do not

- Snap opacity `0 ↔ 100` with no duration
- Toggle overlays with only `display: none` / conditional render when a short fade would work
- Add long, bouncy, or attention-seeking animations by default

## Related

- Preserve existing brand tokens and UI primitives under `src/components/ui/`
- Broader product UI constraints live in the user’s frontend design rules; this skill is the **motion** contract for Blixx DS
