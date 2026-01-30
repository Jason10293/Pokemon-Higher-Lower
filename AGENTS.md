# Repository Guidelines

## Project Structure & Module Organization

- `backend/`: Go API server (`api`, `handlers`, `db`, `types`, `cmd` for entrypoints, `migrations` for SQL migration files).
- `frontend/`: Next.js 16 app (`app` for routes/layout, `lib` for auth config, `utils` for shared helpers, `globals.css` for base styles).
- `supabase/`: Data population script (`populate_db.go`) for seeding the cards table from the Pokemon TCG API.
- `test.json` and `TODO.md`: Ad-hoc fixtures and planning notes; avoid depending on them for production behavior.

## Build, Test, and Development Commands

- Backend dev: `cd backend && go run ./cmd` (starts the API on `:8080`).
- Backend build: `cd backend && go build ./cmd`.
- Backend tests: `cd backend && go test ./...`.
- Frontend dev: `cd frontend && npm install && npm run dev` (Next.js app on `:3000`).
- Frontend lint: `cd frontend && npm run lint`.
- Frontend build: `cd frontend && npm run build`.
- Database: `cd backend && docker compose up -d` (PostgreSQL on `:5432`).
- Migrations: run SQL files in `backend/migrations/` against the database.

## Coding Style & Naming Conventions

- Go: use `gofmt` defaults (tabs, standard import grouping); exported identifiers `PascalCase`, unexported `camelCase`.
- TypeScript/React: 2-space indentation; components in `PascalCase`, variables/functions/hooks in `camelCase`.
- Keep functions small and focused; reuse existing patterns (e.g., `CardHandler`, `CardRoutes`) when adding new endpoints or components.
- Run `npm run lint` and, when possible, `go vet ./...` before opening a PR.

## Testing Guidelines

- Backend: colocate tests with packages (e.g., `backend/handlers/cardHandler_test.go`); cover handler behavior and error paths without calling real external APIs.
- Frontend: prefer React Testing Library and/or Playwright; place tests under `frontend/__tests__/` or next to components.
- Mock external APIs; tests should be deterministic and not depend on network or real credentials.

## Commit & Pull Request Guidelines

- Follow a conventional style: `feat: ...`, `fix: ...`, `chore: ...`; keep subjects imperative and concise.
- PRs should include: a clear summary, motivation/context, implementation notes, and how to verify (commands, URLs, and for UI changes, screenshots).
- Keep changes focused; split unrelated work into separate commits/PRs when possible.

## Security & Configuration Tips

- Never commit real secrets. Keep `.env` files local; values like `DATABASE_URL`, `AUTH_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and `POKEMON_TCG_API_KEY` must not be checked in.
- Database runs via Docker Compose (`backend/docker-compose.yml`); migrations are in `backend/migrations/`.
- Auth is handled by Auth.js (NextAuth v5) in the frontend with PostgreSQL adapter.

## Agent-Specific Instructions

- Prefer minimal, targeted diffs that match existing code style and structure.
- Avoid modifying database schema or migrations unless explicitly requested and documented.
- When repository conventions are unclear, update this `AGENTS.md` with clarifications rather than guessing silently.
