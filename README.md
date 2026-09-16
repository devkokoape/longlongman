# Long Long Man

Memecoin landing page on Arc. Local first, then `longlongman.xyz`.

## Run locally

```bash
cd longlongman
python -m http.server 5173
```

Open [http://localhost:5173](http://localhost:5173).

Windows: double-click `start.bat`.

## Edit

All live values live in `js/config.js`:

- `ca` — contract address (enables Copy + Buy)
- `buyUrl` — optional override (defaults to DYOR on Arc when `ca` is set)
- `xUrl` / `telegramUrl`
- `ticker`, `supply`, `tax`, `lp`, copy

Refresh the page after saving.

## Deploy to longlongman.xyz

1. Register `longlongman.xyz` if it is not live yet.
2. Push this repo to GitHub.
3. Enable GitHub Pages (root of `main`).
4. Point the domain:
   - `A` / `ALIAS` / `CNAME` → GitHub Pages or Cloudflare Pages
   - `CNAME` file in this repo is already set to `longlongman.xyz`
