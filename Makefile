.PHONY: dev

dev:
	@echo "Starting development servers..."
	cd backend/ && go run cmd/server/main.go &
	cd frontend/ && npm run start