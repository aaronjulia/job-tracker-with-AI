# Frontend

React 19 + TypeScript on Vite, with Tailwind v4, shadcn/ui, React Router, and TanStack Query.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Environment

Vite only exposes vars prefixed with `VITE_`, and inlines them **at build time** —
rebuild after changing one.

| Variable       | Default                 | Purpose                |
| -------------- | ----------------------- | ---------------------- |
| `VITE_API_URL` | `http://localhost:8000` | FastAPI backend origin |

Put local overrides in `frontend/.env.local` (gitignored):

```
VITE_API_URL=http://localhost:8000
```

## Scripts

| Script            | Does                                        |
| ----------------- | ------------------------------------------- |
| `npm run dev`     | Dev server with HMR                         |
| `npm run build`   | Typecheck (`tsc -b`) then bundle to `dist/` |
| `npm run preview` | Serve the built bundle locally              |
| `npm run lint`    | oxlint                                      |
| `npm run format`  | Prettier write                              |

## Layout

```
src/
  main.tsx          entry — Providers > BrowserRouter > App
  App.tsx           route table
  providers.tsx     TanStack Query client
  index.css         Tailwind entry + design tokens
  lib/              api client, types, auth hook, cn()
  components/ui/    shadcn primitives
  pages/            one folder per route area
```

Routing is client-side, so any host serving `dist/` must fall back to
`index.html` for unknown paths — see `nginx.conf` for how the container does it.
