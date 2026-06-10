# portfolio/ — Personal Portfolio Site

Li Xuan's personal portfolio. **This folder is a 1:1 mirror of Hostinger `public_html`** — what's here is exactly what gets deployed. Live at the personal domain (Hostinger shared hosting).

## Layout

```
index.html              landing page (hero / about / projects / contact)
css/styles.css          all styles; design tokens as CSS custom properties
js/projects-data.js     project card data array — EDIT THIS to add a new project
js/main.js              renders project cards from the array
assets/                 favicon, photos, thumbnails
projects/               one subfolder per showcased project (kebab-case names)
  llm-journey/          "Journey of a Token" interactive LLM explainer
```

## Adding a new project

1. Drop the project's static files into `projects/<kebab-name>/` (lowercase, no spaces — server filesystem is case-sensitive).
2. Append one object to the array in `js/projects-data.js`.
3. Re-deploy (below).

## Preview locally

```bash
cd "Coding Projects/portfolio" && python3 -m http.server 8000
```

Open http://localhost:8000. Always preview via the server, not `file://`.

## Deploy (git auto-deploy — primary)

This repo is connected to Hostinger via GitHub App (hPanel → Advanced → Git).
**Every push to `main` goes live at kruxqlyz.com in ~10 seconds.**

```bash
cd "Coding Projects/portfolio"
git add -A && git commit -m "describe the change" && git push
```

Then hard-refresh the live site (Cmd+Shift+R). Still stale → hPanel → Cache Manager → purge.
Deploy history / manual redeploy: hPanel → Advanced → Git → Deployments.

Repos: [krux3009/portfolio](https://github.com/krux3009/portfolio) (canonical, live site serves this) ·
[krux3009/llm-journey](https://github.com/krux3009/llm-journey) (standalone showcase mirror — sync manually after editing llm-journey here).

## Deploy fallback (zip via File Manager)

Only if git deploy is broken:

1. Zip the **contents** of this folder (not the folder itself):
   ```bash
   cd "Coding Projects/portfolio" && zip -r ../portfolio-deploy.zip . -x "*.DS_Store" -x ".git/*"
   ```
2. hPanel → Files → File Manager → `public_html` → upload zip → Extract here → delete zip.
3. Verify files sit directly in `public_html`, not in a nested subfolder.

## Conventions

- All filenames lowercase kebab-case (Linux server is case-sensitive; macOS isn't — mismatches 404 in production only).
- Links between pages stay **relative** so they work both locally and deployed.
- `variants/` (if present) = temporary design explorations, never deployed.
