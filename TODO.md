# Pokemon Higher-Lower – Detailed TODOs

## Game & Product Definition
- Lock the game loop: number of cards per round, scoring/streak logic, lose conditions, and UI copy for correct/wrong guesses.
- Define required metadata for each card (name, set, rarity, image URL, market price source, last updated timestamp).
- Decide on supported platforms (desktop web, mobile web) and accessibility requirements.

## Data Sourcing & ETL
- Select a reliable Pokémon card price provider (API, marketplace scrape, etc.) and document request quotas/auth.
- Write a fetcher module that normalizes card + price fields and flags missing images/prices.
- Implement validation to drop malformed records and log the reason for each rejection.
- Store raw payload snapshots (S3/local disk) for troubleshooting ETL regressions.

## Supabase Database Setup
- Create a Supabase project (and locally run `supabase start`) with managed Postgres + auth; capture service-role key securely.
- Define SQL migrations for `cards`, `card_prices`, and `price_updates` tables including indexes on card id + updated_at; check them into the Supabase `migrations` folder.
- Seed the database via Supabase seed scripts or `supabase db reset` to load a minimal card set for developers.
- Configure Row Level Security policies (even for service usage) and describe ERD relationships that gameplay/API queries rely on.

## Data Refresh (every 3 days)
- Implement an idempotent ETL runner that: fetches source data, upserts cards, inserts latest price row, and records run status.
- Schedule the runner via cron/Temporal/Celery/Cloud Scheduler to execute every 72 hours.
- Persist run metadata (started_at, finished_at, success flag, error text) for monitoring dashboards.
- Add alerting (email/Slack) when a refresh fails or runs beyond expected duration.

## Backend Service
- Boot a web service (Express/Fastify/Nest/etc.) that talks to Supabase via service-role connection string or Supabase client SDK.
- Add API endpoints:
  - `GET /health` for uptime monitoring.
  - `GET /game/hand` that returns two random cards with one price hidden.
  - `POST /game/guess` that accepts guess payload, validates it, updates streak, and responds with result + next card.
- Implement caching/shuffling logic so the same card pair is not reused too frequently.
- Record anonymized gameplay stats (rounds played, average streak, mis-guess card ids).

## Frontend
- Scaffold frontend (React/Vite/Next) and set up shared UI primitives (card display, buttons, loaders).
- Build screens: landing page, active game view, round result modal, leaderboard/stats view.
- Integrate backend APIs with optimistic UI for guess submissions and animations for higher/lower reveal.
- Add responsive layout, keyboard controls, and accessible focus management.

## Testing & QA
- Write unit tests for ETL normalization, DB repositories, and API handlers.
- Mock external price provider in integration tests to validate a full refresh run.
- Add frontend component tests (React Testing Library/Cypress) covering at least one full higher/lower flow.
- Create load test script to ensure API can serve concurrent guess requests without DB bottlenecks.

## DevEx & Deployment
- Provide `.env.example` with Supabase keys (anon + service-role), API secrets, and scheduler credentials.
- Configure logger/metrics (e.g., pino + Prometheus) for backend and ETL jobs.
- Add Dockerfiles + docker-compose (or Supabase CLI workflows) for local stack: frontend, backend, Supabase containers, and the cron worker.
- Document deploy steps: Supabase migration promotion, backend rollout, job scheduling (Supabase cron functions or external scheduler), and rollback strategy.
