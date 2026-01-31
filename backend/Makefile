include .env
.PHONY: migrate-new migrate-up migrate-down

migrate-new:
	@read -p "Enter migration name: " name; \
	migrate create -ext sql -dir db/migrations -seq $$name

migrate-up:
	migrate -path db/migrations -database "${DATABASE_URL}" up

migrate-down:
	migrate -path db/migrations -database "${DATABASE_URL}" down 1
