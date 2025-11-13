# Repository Guidelines

## Project Structure & Module Organization

- `backend/`: Go API server (`api`, `handlers`, `db`, `types`, `cmd` for entrypoints, `supabase` for local config/migrations).
- `frontend/`: Next.js 16 app (`app` for routes/layout, `utils` for shared helpers, `globals.css` for base styles).
- `supabase/`: Root Supabase project directory (may be empty locally); backend-specific config lives in `backend/supabase/`.
- `test.json` and `TODO.md`: Ad-hoc fixtures and planning notes; avoid depending on them for production behavior.

## Build, Test, and Development Commands

- Backend dev: `go run ./backend/cmd` (starts the API on `:8080`).
- Backend build: `go build ./backend/cmd`.
- Frontend dev: `cd frontend && npm install && npm run dev` (Next.js app on `:3000`).
- Frontend lint: `cd frontend && npm run lint`.
- Tests: currently no automated tests. Once added, prefer `go test ./...` from the repo root and `cd frontend && npm test` (or the configured test runner).

## Coding Style & Naming Conventions

- Go: use `gofmt` defaults (tabs, standard import grouping); exported identifiers `PascalCase`, unexported `camelCase`.
- TypeScript/React: 2-space indentation; components in `PascalCase`, variables/functions/hooks in `camelCase`.
- Keep functions small and focused; reuse existing patterns (e.g., `CardHandler`, `CardRoutes`) when adding new endpoints or components.
- Run `npm run lint` and, when possible, `go vet ./...` before opening a PR.

## Testing Guidelines

- Backend: colocate tests with packages (e.g., `backend/handlers/cardHandler_test.go`); cover handler behavior and error paths without calling real external APIs.
- Frontend: prefer React Testing Library and/or Playwright; place tests under `frontend/__tests__/` or next to components.
- Mock the Pokemon TCG API and Supabase; tests should be deterministic and not depend on network or real credentials.

## Commit & Pull Request Guidelines

- Follow a conventional style: `feat: ...`, `fix: ...`, `chore: ...`; keep subjects imperative and concise.
- PRs should include: a clear summary, motivation/context, implementation notes, and how to verify (commands, URLs, and for UI changes, screenshots).
- Keep changes focused; split unrelated work into separate commits/PRs when possible.

## Security & Configuration Tips

- Never commit real secrets. Keep `.env` files local; values like `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `POKEMON_TCG_API_KEY` must not be checked in.
- Supabase local settings live in `backend/supabase/config.toml`; coordinate before changing ports, auth settings, or seed data.

## Agent-Specific Instructions

- Prefer minimal, targeted diffs that match existing code style and structure.
- Avoid modifying database schema, Supabase configuration, or migrations unless explicitly requested and documented.
- When repository conventions are unclear, update this `AGENTS.md` with clarifications rather than guessing silently.

