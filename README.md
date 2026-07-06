# portfolio/ — Personal Portfolio Site

Li Xuan's personal portfolio. **This folder is a 1:1 mirror of Hostinger `public_html`** — what's here is exactly what gets deployed. Live at the personal domain (Hostinger shared hosting).

## Layout

```
index.html              landing page (hero + personal intro + hobbies — NOT the resume)
projects/index.html     projects tab (card grid)
resume.html             resume tab (stub until resume is done)
css/styles.css          all styles; design tokens as CSS custom properties
js/i18n.js              EN/中文 dictionary + system-language detection — ALL page copy lives here
js/projects-data.js     project card data array (bilingual fields) — EDIT THIS to add a new project
js/main.js              renders project cards from the array
assets/                 favicon, photos, thumbnails
projects/               one subfolder per showcased project (kebab-case names)
  llm-journey/          "Journey of a Token" interactive LLM explainer
```

Editing page text: change BOTH `en:` and `zh:` entries in `js/i18n.js` (the HTML only holds English fallbacks for no-JS visitors). Contact links live in each page's nav dropdown.

## Adding a new project

1. Drop the project's static files into `projects/<kebab-name>/` (lowercase, no spaces — server filesystem is case-sensitive).
2. Append one object to the array in `js/projects-data.js`.
3. Re-deploy (below).

## Preview locally

```bash
cd "$HOME/Me Vault/portfolio" && python3 -m http.server 8000
```

Open http://localhost:8000. Always preview via the server, not `file://`.

## Deploy (git auto-deploy — primary)

This repo is connected to Hostinger via GitHub App (hPanel → Advanced → Git).
**Every push to `main` goes live at kruxqlyz.com in ~10 seconds.**

```bash
cd "$HOME/Me Vault/portfolio"
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
   cd "$HOME/Me Vault/portfolio" && zip -r ../portfolio-deploy.zip . -x "*.DS_Store" -x ".git/*"
   ```
2. hPanel → Files → File Manager → `public_html` → upload zip → Extract here → delete zip.
3. Verify files sit directly in `public_html`, not in a nested subfolder.

## Conventions

- All filenames lowercase kebab-case (Linux server is case-sensitive; macOS isn't — mismatches 404 in production only).
- Links and asset paths are **root-absolute** (`/css/styles.css`, `/projects/llm-journey/`) — they work identically on the local preview server and in production, but break under `file://` (preview via the server, always).
- `variants/` (if present) = temporary design explorations, never deployed.

<!-- deploy-probe 2026-07-07 -->
