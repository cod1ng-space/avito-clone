.DEFAULT_GOAL := dev

 .PHONY: build dev prod
# Build docker images manually
build:
	docker compose build

# Run project in development mode (with live reload)
dev:
	docker compose -f docker-compose.yml -f docker-compose.dev.yml up

# Run project in production mode (detached)
prod:
	docker compose up --build -d
