# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Li Xuan's personal portfolio at kruxqlyz.com. Single-page React app: Vite + TypeScript + Tailwind v4 + motion (Framer Motion), deployed on Vercel (push to `main` → live; branches get preview URLs). Rebuilt 2026-07 from a vanilla-JS static site; the old site lives in git history before the `redesign` merge.

Read `PRODUCT.md` (strategy, audience, anti-references) and `DESIGN.md` (tokens, type, motion rules) before design work. The short version: warm dark "lamplit desk" aesthetic, projects as interactive exhibits, quietly playful, precise motion. NOT: generic dev-portfolio tropes, terminal/hacker mono-everything, cold slate dark mode.

## Commands

```bash
npm run dev        # dev server, http://localhost:5173
npm run build      # tsc -b && vite build → dist/
npm run preview    # serve dist/ (needed to test public/ passthrough + redirects)
```

No test suite. Success criterion is the rendered page: verify changes in the browser in BOTH languages — every render path forks on language.

## Architecture

- **`src/copy.ts` is the single source of all user-visible text.** Every string is a `Bi` (`{ en, zh }`). 中文 is written for the reader, not translated word-for-word. A new string without both languages is a bug.
- **`src/i18n.tsx`**: `LangProvider` + `useLang()`. Detection: localStorage `lang` → system language → en. `t(bi)` picks the current language; toggling re-renders everything.
- **`src/styles.css`**: Tailwind v4 (`@import "tailwindcss"` + `@theme`). Design tokens are the `--color-*` / `--font-*` vars there; use token classes (`bg-night`, `text-cream`, `text-ember`, …), never raw hex.
- **Exhibits** (`components/Exhibit.tsx`): each project is a full-width section owning one hue (ember / field / signal), a cursor spotlight, and a bespoke demo from `components/demos/`. Layouts alternate via `flip`; do not collapse them into a uniform card grid.
- **Motion**: `motion` is the only animation library — no GSAP. Every animated component must branch on `useReducedMotion()` and collapse to static states. Nothing loops forever except inside a demo while it is on screen and reduced-motion is off.
- **React Bits adaptations** (ClickSpark, Magnet, spotlight, AnimatedNumber) are owned in-repo; edit them directly, don't try to "update" from upstream.

## public/projects/llm-journey/ — do not modernize

Self-contained sub-project served verbatim at `/projects/llm-journey/`. It keeps its own i18n, CSS, and build step: edit `src/*.jsx`, run `build.sh`, commit `dist/*.js`. Never edit its `dist/` or HTML script tags by hand. Copy rule there: metaphor-first, official terms behind the 📄 toggle. Mirrored manually to the standalone repo [krux3009/llm-journey](https://github.com/krux3009/llm-journey).

## Conventions

- Filenames lowercase kebab-case (Linux server + macOS case mismatch 404s only in production).
- Root-absolute paths for public assets (`/assets/...`, `/projects/llm-journey/`).
- Retired URLs (`/resume.html`, `/hobbies/*`, `/projects/`) redirect via `vercel.json`; keep them working.
- Keep the dependency count where it is (react, react-dom, motion). New deps need a reason a few lines of code can't cover.
- No em dashes in copy, either language. Bans in DESIGN.md apply (no glitch/scramble text, no card grids for projects, mono in trace amounts only).
