# Job Application Tracker

AI-powered job application tracking system.

## Structure

- `frontend/` — React 19 + Vite, TypeScript, Tailwind v4, shadcn/ui, React Router, TanStack Query
- `backend/` — FastAPI, SQLAlchemy, PostgreSQL

## Running with Docker

```bash
cp .env.example .env      # then fill in JWT_SECRET_KEY and OPENAI_API_KEY
docker compose up --build
```

- Frontend: http://localhost:3000
- API: http://localhost:8000 (docs at `/docs`)
- Postgres: localhost:5432

The backend runs `alembic upgrade head` on start, so the schema is created on
first boot. Data lives in the `pgdata` volume; `docker compose down -v` wipes it.

`VITE_API_URL` is baked into the frontend bundle at build time, so changing it
requires `docker compose build frontend`, not just a restart.

## Running locally

See `frontend/README.md` and `backend/README.md` for service-specific setup.
