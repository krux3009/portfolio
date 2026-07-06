# 2026-07-07 — Full React rebuild on `redesign` branch

## What happened

Complete redo of the portfolio, replacing the vanilla-JS sketchbook site. All decisions were made with Li Xuan via a grill session; they are recorded in `PRODUCT.md` (strategy) and `DESIGN.md` (visual system). Stack: React + Vite + TypeScript + Tailwind v4 + motion, single page, bilingual EN/中文, deployed on Vercel.

Design: "lamplit desk" — warm espresso dark, cream text, old site's rust/blue/green reborn as ember/field/signal, one hue per project exhibit. Young Serif + Karla (Noto Serif SC / PingFang for 中文). Projects are full-width exhibits with bespoke interactive demos (toy tokenizer, 500-run Poisson Monte Carlo, ticking sparkline), not cards. Motion is choreographed and collapses under prefers-reduced-motion. Easter eggs: console message, click sparks, shuttlecock in About.

## State

- Rebuild complete, builds clean (`npm run build`), verified in Playwright (EN + 中文, desktop + 390px mobile).
- llm-journey moved to `public/projects/llm-journey/` verbatim (same URL, own build step intact, still mirrored manually to krux3009/llm-journey).
- Old URLs redirect via `vercel.json`.

## Migration: COMPLETE (same session, 2026-07-07)

All go-live steps done and verified: Vercel project imported (production branch `main`), Hostinger GitHub auto-deploy disconnected (probe-tested both directions), `redesign` merged to `main` (52e502d), DNS flipped (A `@` → 216.198.79.1, CNAME `www` → 3c6e87f95d39e3e8.vercel-dns-017.com; apex 308-redirects to www). Live checks passed: new site serves with SSL, `/projects/llm-journey/` 200, `/resume.html` + `/hobbies/*` + `/projects/` redirect correctly. Vault-root CLAUDE.md row updated. Workflow now: push to `main` = live in ~30 s. Hostinger hosting plan unused (user may cancel hosting; domain registration + DNS zone must stay).

Note: this Mac runs a fake-IP DNS proxy — local `dig` results are unreliable. Verify DNS via DoH (`curl "https://dns.google/resolve?name=...&type=A"`) and the live site via `curl --resolve host:443:IP`.

## Next session: slogan + pictures

1. **Change the slogan.** Hero H1 is currently "I turn 'how does that work?' into things you can click." / 我把「这是怎么做到的？」变成一个个点得动的小东西。 Li Xuan wants a new one. Lives in `src/copy.ts` → `copy.hero.h1a` / `h1b` (`h1b` = the ember-highlighted span). Rewrite both languages in the same warm voice (PRODUCT.md); no em dashes.
2. **Add pictures.** Site is currently type-only. Ask Li Xuan which images and where (about section? hero? exhibit screenshots?) before designing placement. Files go in `public/assets/`, lowercase kebab-case, webp preferred, small (mobile-at-night weight budget in PRODUCT.md). Any alt text/captions need both languages via `copy.ts`. `/assets/pitchside-bilingual.webp` already exists from the old site.

## Gotchas for future sessions

- Every string lives in `src/copy.ts` as `{ en, zh }`; both languages mandatory.
- `motion` is the only animation lib; no GSAP, no WebGL backgrounds (DESIGN.md bans).
- Old sketchbook site retrievable from git history before the redesign merge.
