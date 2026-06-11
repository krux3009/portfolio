# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Li Xuan's personal portfolio — a static site with **no framework, no build step, no dependencies, no tests**. Vanilla HTML/CSS/JS. This repo is a 1:1 mirror of Hostinger `public_html`; everything here is exactly what gets served at kruxqlyz.com.

## Commands

```bash
# Preview locally (always via server, never file:// — root-absolute paths break otherwise)
python3 -m http.server 8000        # then open http://localhost:8000

# Deploy = push to main. Hostinger GitHub auto-deploy goes live in ~10s.
git add -A && git commit -m "..." && git push
```

After deploy, hard-refresh (Cmd+Shift+R). Still stale → hPanel → Cache Manager → purge. Fallback zip-deploy procedure is in README.md.

## Architecture

**i18n is the backbone.** `js/i18n.js` holds the full EN/中文 dictionary in one IIFE (`I18N`). Pages mark translatable elements with `data-i18n="key"` (text) or `data-i18n-html="key"` (markup). The HTML carries English-only fallbacks for no-JS visitors; **all real copy lives in i18n.js — edit BOTH `en:` and `zh:` entries**. Language detection: localStorage → system language → English. Toggling fires a `langchange` event on `document`; render scripts listen and re-render.

**Data-driven pages.** Content lives in data arrays; tiny render scripts turn them into DOM, re-rendering on `langchange`:

- `js/projects-data.js` (`PROJECTS` array, bilingual fields) → `js/main.js` renders cards into `#project-grid` on `/projects/`. Newest project goes at the TOP of the array.
- `js/hobbies-data.js` (`HOBBY_TIMELINES`) → `js/timeline.js` renders scroll-driven timelines. A hobby page selects its dataset via `<body data-hobby="badminton|games">`; the center line grows with scroll progress, milestones reveal via IntersectionObserver.
- `js/decor.js` — landing-page reveal-on-scroll + easter eggs (shuttlecock click, console message).

**Showcased projects are self-contained.** Each lives in `projects/<kebab-name>/` with its own CSS and its own i18n — they do NOT load the site's `css/styles.css` or `js/i18n.js`. Only the shared color tokens (`--paper/--ink/--blue/--rust/--green`) are duplicated to match the site's sketchbook look.

**llm-journey has a local build step** (the one exception to "no build"): source of truth is `projects/llm-journey/src/*.jsx` (shared.jsx = i18n + toy LM + scenes; stepper.jsx = the guided-tour shell, served as the project's index.html — stepper.html/scrolly.html are redirect stubs for old links). After editing src/, run `projects/llm-journey/build.sh` (Babel via npx, cached in gitignored `.build-cache/`) and commit the compiled `dist/*.js` — the server has no build pipeline; dist/ is what the HTML loads. Never edit dist/ or the page HTML's script tags by hand. Copy rule for this project: metaphor-first body text; official terms only in the per-station "📄 in the papers" tag and the Station-8 decoder.

**Styling.** All site styles in `css/styles.css`; design tokens are CSS custom properties at the top (`:root`). Fonts: Caveat (headings) + Nunito (body) from Google Fonts.

**Caching.** `.htaccess` sets CSS/JS to `no-cache, must-revalidate` (deploys reach visitors immediately) and images/fonts to 30-day cache. Keep this in mind before adding fingerprinting/versioning — it's intentionally not needed.

## Adding a new project

1. Drop static files into `projects/<kebab-name>/` (self-contained, inline styles).
2. Append one object to the TOP of the array in `js/projects-data.js` (use `link: null` + `status: "ongoing"` if not public yet; `link` is a root-absolute path like `/projects/llm-journey/`).
3. Push to deploy.

`projects/llm-journey/` is also mirrored to the standalone repo [krux3009/llm-journey](https://github.com/krux3009/llm-journey) — sync manually after editing it here.

## Working style

Adapted from [andrej-karpathy-skills CLAUDE.md](https://github.com/multica-ai/andrej-karpathy-skills/blob/main/CLAUDE.md) — biases toward caution over speed; use judgment on trivial tasks.

1. **Think before coding.** State assumptions; if multiple interpretations exist, present them — don't pick silently. If a simpler approach exists, say so and push back.
2. **Simplicity first.** Minimum code that solves the problem. No speculative abstractions, configurability, or error handling for impossible scenarios — this site is intentionally ~300 lines of JS total; keep it that way.
3. **Surgical changes.** Touch only what the request requires. Match existing style (ES5, string-concat templates) even if you'd write it differently. Don't "improve" adjacent code; mention unrelated dead code instead of deleting it. Remove only orphans YOUR change created.
4. **Goal-driven execution.** No test suite here — success criterion is the rendered page. Verify changes in the local preview server (both EN and 中文, since every render path forks on language) before calling work done.

## Conventions

- **Filenames lowercase kebab-case.** The Linux server is case-sensitive; macOS isn't — a case mismatch 404s in production only.
- **Paths are root-absolute** (`/css/styles.css`, `/projects/llm-journey/`) across all pages and data files. (README.md says "relative" — that's stale; follow the code.)
- Bilingual content everywhere: any new user-visible string needs both EN and 中文 (`*Zh` fields in data files, `en:`/`zh:` keys in i18n.js).
- `[PLACEHOLDER]`-marked text in `js/hobbies-data.js` is intentional stub copy awaiting the real story — don't invent content for it.
- `variants/` (if present) = temporary design explorations, never deployed.
- Keep the no-framework character: ES5-style vanilla JS (IIFEs, `function` declarations, string-concat templates), no npm, no bundler.
