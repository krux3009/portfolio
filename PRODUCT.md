# Product

## Register

brand

## Users

Peers and internet strangers, arriving from a shared link (group chat, WeChat, Discord, a GitHub README) usually on a phone, often at night. They came to see the projects, not to hire. Secondary: SMU classmates and future recruiters who land here later.

Job to be done: "show me the thing you built and make it worth the tap." Success = they play with a project demo, maybe share the link onward.

## Product Purpose

Li Xuan's personal site at kruxqlyz.com. A single-page, project-led portfolio: three projects presented as interactive exhibits with bespoke mini-demos, a short about, contact links. Fully bilingual EN/中文 (Li Xuan is an SMU Information Systems student in Singapore interning at StepFun in AI product ops; the audience genuinely spans both languages).

The site replaces a hand-built vanilla-JS "sketchbook" site. The rebuild is React + Vite + TypeScript + Tailwind, deployed on Vercel. The existing interactive explainer at /projects/llm-journey/ is preserved untouched at its URL.

## Brand Personality

Warm, thoughtful, crafted. The physical scene: a lamplit desk in a dark room, warm light pooled on careful work. Curiosity is the underlying energy ("how does that work?" turned into things you can click), expressed gently rather than loudly. Quietly playful: wit lives in microcopy, small interactions, and one or two easter eggs, never in visual noise.

## Anti-references

- Generic dev-portfolio template: headshot hero, skill percentage bars, timeline of jobs, "passionate developer" copy, identical project card grid.
- Terminal/hacker aesthetic: green-on-black, monospace-everything, fake CLI chrome. Monospace only in trace amounts, if at all.
- The saturated editorial-typographic lane: italic display serif + tracked mono labels + hairline rules + monochrome restraint. This site is warm and colored, not a Klim clone.
- Cold slate-gray "dark mode default." Dark here means lamplight-warm, not GitHub-dark.

## Design Principles

1. **Projects are the site.** Every project panel earns interaction: a hand-built demo you can touch, not a screenshot in a card.
2. **Warmth survives the dark.** The old site's paper/rust/blue/green identity carries into the dark theme; continuity of soul, not of style.
3. **Precise, not loud.** Every animation earns its place; motion is choreographed, springy, and brief. No permanent background canvases.
4. **Two languages, one voice.** 中文 copy is written, not translated word-for-word; both languages get the same warmth.
5. **Fast on a phone at night.** The primary reader is on mobile data. Weight budgets beat wow.

## Accessibility & Inclusion

WCAG AA contrast on dark surfaces. Full keyboard navigation. prefers-reduced-motion collapses all animation to instant states. Language toggle accessible and persistent (localStorage → system language → English).
