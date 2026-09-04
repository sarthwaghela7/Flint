# Flint — Frontend

The entire Flint web app, deployed as a single static site:

| Route | What it is |
|---|---|
| `/` | Portfolio / landing site |
| `/services` | Services catalog |
| `/nest` | Team login (rule-based, frontend-only) |
| `/app/*` | Nest mail client (login-gated) |
| `/app/vct/*` | VCT video conferencing |

## Deploy (Render)

Use the included [`render.yaml`](render.yaml) blueprint, or configure manually:

- **Root Directory:** `Frontend` *(when deploying from the repo root)*
- **Build Command:** `npm install && npm run build`
- **Publish Directory:** `dist`
- **Redirects/Rewrites** (in order):
  1. `/api/*` → `https://<backend>.onrender.com/api/*` — Rewrite (proxy)
  2. `/ws/*` → `https://<backend>.onrender.com/ws/*` — Rewrite (proxy, VCT WebSocket)
  3. `/*` → `/index.html` — Rewrite (SPA fallback — required for `/nest` etc.)

## Backend

Lives in the [flint_video_conferencing](https://github.com/sarthwaghela7/flint_video_conferencing) repo — FastAPI serving `/api/*` (mail + meetings + contact) and `/ws/signaling/*` (WebRTC signaling).

## Local dev

```sh
npm install
npm run dev   # vite proxies /api to http://localhost:8000
```
