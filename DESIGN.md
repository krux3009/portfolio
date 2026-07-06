# Design

## Visual Theme

"Lamplit desk." A dark, warm room where each piece of work sits in its own pool of light. Dark is justified by the reading scene (shared link, phone, night), and the warmth is the identity thread carried over from the old paper-sketchbook site. Not GitHub-dark, not slate: espresso-brown blacks, cream text, colored light.

Quietly playful: interaction warmth (cursor-following light, click sparks, magnetic buttons, easter eggs) instead of visual noise. No permanent animated backgrounds, no WebGL.

## Color

All colors OKLCH. Strategy: **full palette** — three project hues inherited from the old site (rust, blue, green) recast as light sources on a warm dark ground. Each project exhibit owns one hue; the rest of the page stays warm-neutral so the hues read as lamplight, not decoration.

```css
:root {
  /* ground */
  --night: oklch(0.185 0.012 55);        /* page background, espresso black */
  --night-soft: oklch(0.225 0.014 55);   /* raised surfaces */
  --night-line: oklch(0.32 0.016 55);    /* borders, 1px only */

  /* text */
  --cream: oklch(0.93 0.02 85);          /* primary text, warm paper */
  --cream-dim: oklch(0.72 0.02 80);      /* secondary text (AA on --night) */

  /* project hues (old site's rust/blue/green, tuned for dark) */
  --ember: oklch(0.68 0.15 45);          /* rust reborn — llm-journey, and the site accent */
  --field: oklch(0.72 0.14 150);         /* green — Pitchside */
  --signal: oklch(0.74 0.12 245);        /* blue — Investment Dashboard */
}
```

Accent usage: `--ember` is the site-wide accent (links, toggle, focus rings). `--field` and `--signal` appear only inside their project's exhibit. Glows are the hue at low alpha (8–15%), large radius.

Contrast floor: WCAG AA. --cream on --night ≈ 12:1; --cream-dim on --night ≥ 4.6:1; hue-on-night combinations checked per use.

## Typography

- **Display (EN):** Young Serif, 400 only. Warm, chunky, bookish; hierarchy through size, not weight. Used for the masthead, section titles, project names.
- **Body + UI (EN):** Karla, 400/500/700. Humanist grotesque with quirk; warm at small sizes.
- **中文 display:** Noto Serif SC 500 (Google Fonts CJK unicode-range slices keep it light).
- **中文 body:** system stack — `"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif`.
- Scale: fluid clamp(), ratio ≥ 1.3 between steps. Hero display up to `clamp(2.8rem, 8vw, 6.5rem)`.
- Body line-height 1.7 on dark (light-on-dark needs extra lead), max width 68ch.
- Monospace: trace amounts only (a stat readout inside a demo). Never for labels/headers (terminal aesthetic is an anti-reference).

## Layout

Single long scroll, one dominant idea per fold. Left-aligned, asymmetric; the grid breaks deliberately at the hero and between exhibits. Projects are full-width **exhibits**, not cards in a grid: each alternates composition (demo left / text right, then flipped), owns its hue, and gets generous vertical separation (`clamp(6rem, 14vh, 10rem)`). Tight groupings inside each exhibit.

Sections: masthead/hero → three project exhibits → about (short, hobbies woven in) → contact/footer.

## Motion

Library: `motion` (Framer Motion) only. No GSAP. React-bits pieces used are the motion-only or zero-dependency ones, copied as TS+Tailwind variants and owned in-repo: SpotlightCard (cursor lamplight on exhibits), Magnet (contact buttons), ClickSpark (ember sparks on click, site-wide), BlurText/stagger reveals (hero), CountUp (demo stats).

Rules: ease-out expo/quint, durations 300–700ms, stagger ≤ 60ms per item. Scroll reveals via `whileInView` with `once: true`. Nothing loops forever except inside a demo the user started. `prefers-reduced-motion`: all entrance animation collapses to visible; demos render final states.

## Components

- **Exhibit**: full-width project section. Hue-tinted spotlight follows cursor; bespoke interactive mini-demo (hand-built per project) on one side, name + one-paragraph story + stack line + link on the other.
- **Mini-demos**: llm-journey → type-in token-stream toy; Pitchside → animated win-probability bars; Investment Dashboard → ticking sparkline. Each is a small self-contained React component, hue-locked to its exhibit.
- **Language toggle**: EN/中文 pill in the masthead, persists to localStorage, re-renders in place.
- **Buttons/links**: cream text, ember underline grow on hover, magnetic pull on primary CTAs.
- **Footer**: quiet, one line of warmth, kruxqlyz wordmark as flavor.

## Bans (project-specific, on top of impeccable's)

- No cards-in-a-grid for projects. No identical repeated layouts.
- No italic-serif + mono-label + hairline-rule editorial fingerprint.
- No scramble/decrypt/glitch text effects (reads terminal-hacker).
- No em dashes in copy, either language.
