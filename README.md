# coronagame

Monorepo: Next.js frontend + Express/Socket.io backend.

## Structure

- `frontend/` — Next.js 12 client + admin UI
- `backend/` — Express API, games, Socket.io

## Setup

```bash
# Backend
cp backend/config.env.example backend/config.env
cd backend && npm install && npm run dev

# Frontend
cp frontend/.env.example frontend/.env.local
cd frontend && npm install --force && npm run dev
```

Copy env examples and fill real values. Do not commit `config.env`, `.env.local`, or `info.md`.

## Production deploy

**Do not** ad-hoc `rsync` env files. Prod endpoints live only in:

- `/www/wwwroot/coronacasino/secrets/backend.config.env`
- `/www/wwwroot/coronacasino/secrets/frontend.env.local`

```bash
chmod +x scripts/deploy-prod.sh
./scripts/deploy-prod.sh
```

Backend refuses to boot if endpoints still contain legacy `cbvnsjeikd` domains.
