# vocab

## Deployment (Vercel)

This project uses Vite for the frontend and Vercel serverless functions in `api/`.

- Frontend SPA is served from `dist`.
- API endpoints are available under `/api/*` (for example: `/api/extract`).
- Routing is configured in `vercel.json` using rewrites so API routes are handled before SPA fallback.
