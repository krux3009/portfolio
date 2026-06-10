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

## Deploy / re-deploy (Hostinger hPanel)

1. Edit files **here, locally** — never edit on the server. This folder is the source of truth.
2. Preview locally (above), click through every changed link.
3. Zip the **contents** of this folder (not the folder itself), excluding junk:
   ```bash
   cd "Coding Projects/portfolio" && zip -r ../portfolio-deploy.zip . -x "*.DS_Store" -x "__MACOSX/*" -x "variants/*"
   ```
4. hpanel.hostinger.com → Websites → domain → Manage → Files → **File Manager** → `public_html`.
5. Upload the zip → right-click → Extract here (overwrites) → delete the zip.
6. Hard-refresh the live site (Cmd+Shift+R). Still stale → hPanel → Cache Manager → purge.

**One-file shortcut:** if you only changed one file (e.g. added a project card = `js/projects-data.js`), upload just that file into its matching path in File Manager instead of re-zipping everything.

## Conventions

- All filenames lowercase kebab-case (Linux server is case-sensitive; macOS isn't — mismatches 404 in production only).
- Links between pages stay **relative** so they work both locally and deployed.
- `variants/` (if present) = temporary design explorations, never deployed.
