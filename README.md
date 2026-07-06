# kruxqlyz.com — Li Xuan's portfolio

Single-page, bilingual (EN/中文) portfolio. React + Vite + TypeScript + Tailwind v4 + motion, deployed on Vercel.

Design language: "lamplit desk." Warm dark ground, three project hues (ember / field / signal) inherited from the old sketchbook site, Young Serif + Karla type, quiet choreographed motion. Strategy and tokens live in `PRODUCT.md` and `DESIGN.md`.

## Develop

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # tsc + vite build → dist/
npm run preview    # serve the production build
```

## Deploy

Push to `main` → Vercel builds and deploys. Framework preset: Vite (auto-detected). Preview deployments per branch/PR.

One-time setup after the rebuild merges:

1. vercel.com → Add New Project → import `krux3009/portfolio`, keep defaults (Vite, `npm run build`, `dist`).
2. Project → Settings → Domains → add `kruxqlyz.com` (+ `www`), follow the DNS instructions in Hostinger's DNS zone editor (A record → 76.76.21.21, CNAME `www` → cname.vercel-dns.com).
3. hPanel → remove the old GitHub auto-deploy hook so Hostinger stops publishing `main` into `public_html`.

## Layout

```
index.html                  Vite entry (fonts, meta)
src/
  main.tsx                  bootstrap + console easter egg
  App.tsx                   page assembly
  i18n.tsx                  language context (localStorage → system → en)
  copy.ts                   ALL user-visible text, both languages
  styles.css                Tailwind v4 import + design tokens (@theme)
  components/               masthead, hero, exhibit shell, about, contact, footer
  components/demos/         one bespoke interactive demo per project
public/
  assets/                   favicon, images
  projects/llm-journey/     self-contained sub-project, served verbatim at its URL
vercel.json                 redirects for retired routes (/resume.html, /hobbies/*)
```

`public/projects/llm-journey/` keeps its own build step (`build.sh`, Babel) and is mirrored to [krux3009/llm-journey](https://github.com/krux3009/llm-journey); sync manually after editing.
