# 2026-07-07 — Full React rebuild on `redesign` branch

## What happened

Complete redo of the portfolio, replacing the vanilla-JS sketchbook site. All decisions were made with Li Xuan via a grill session; they are recorded in `PRODUCT.md` (strategy) and `DESIGN.md` (visual system). Stack: React + Vite + TypeScript + Tailwind v4 + motion, single page, bilingual EN/中文, deployed on Vercel.

Design: "lamplit desk" — warm espresso dark, cream text, old site's rust/blue/green reborn as ember/field/signal, one hue per project exhibit. Young Serif + Karla (Noto Serif SC / PingFang for 中文). Projects are full-width exhibits with bespoke interactive demos (toy tokenizer, 500-run Poisson Monte Carlo, ticking sparkline), not cards. Motion is choreographed and collapses under prefers-reduced-motion. Easter eggs: console message, click sparks, shuttlecock in About.

## State

- `redesign` branch: complete, builds clean (`npm run build`), verified in Playwright (EN + 中文, desktop + 390px mobile, llm-journey URL serves from `public/`).
- `main`: untouched, still the old site, still what Hostinger serves. Live site unaffected.
- llm-journey moved to `public/projects/llm-journey/` verbatim (same URL, own build step intact, still mirrored manually to krux3009/llm-journey).
- Old URLs redirect via `vercel.json`.

## Next steps (user actions)

1. Push `redesign` to GitHub, import repo into Vercel (Vite preset, defaults) → check the preview URL.
2. If happy: merge `redesign` → `main`.
3. **Before or immediately after merging**: remove Hostinger's GitHub auto-deploy (hPanel) — otherwise Hostinger publishes React source into public_html and breaks kruxqlyz.com.
4. Point DNS at Vercel (A 76.76.21.21, CNAME www → cname.vercel-dns.com) in Hostinger's DNS editor. Add kruxqlyz.com in Vercel → Domains.
5. Update vault-root CLAUDE.md's portfolio row (it still says "mirrors public_html 1:1, Hostinger").

## Gotchas for future sessions

- Every string lives in `src/copy.ts` as `{ en, zh }`; both languages mandatory.
- `motion` is the only animation lib; no GSAP, no WebGL backgrounds (DESIGN.md bans).
- Old sketchbook site retrievable from git history before the redesign merge.
