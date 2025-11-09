.PHONY: dev start stop db-setup db-reset migrate-up migrate-down migrate-create full-setup

# Development commands
dev:
	@echo "Starting development servers..."
	cd backend/ && go run cmd/server/main.go &
	cd frontend/ && npm run start

start:
	@echo "Starting production servers..."
	docker compose up --build

stop:
	@echo "Stopping all services..."
	docker compose down


# Переменные для подключения к БД
DB_URL=postgres://postgres:postgre@localhost:5432/db-omega?sslmode=disable
MIGRATIONS_PATH=backend/migrations
VERSION = 3

# Полная настройка проекта
full-setup:
	@echo "Полная настройка проекта..."
	make db-up
	@echo "Проект готов к работе!"

# Сброс и пересоздание БД
db-reset:
	@echo "Сброс базы данных..."
	make db-drop || true
	make db-up
	@echo "База данных пересоздана!"

# Миграции базы данных (через CLI migrate)
db-up:
	@echo "Применение всех миграций через CLI..."
	migrate -path $(MIGRATIONS_PATH) -database "$(DB_URL)" up

db-down:
	@echo "Откат всех миграций через CLI..."
	migrate -path $(MIGRATIONS_PATH) -database "$(DB_URL)" down -all

db-down-1:
	@echo "Откат последней миграции через CLI..."
	migrate -path $(MIGRATIONS_PATH) -database "$(DB_URL)" down 1

db-version:
	@echo "Текущая версия миграций..."
	migrate -path $(MIGRATIONS_PATH) -database "$(DB_URL)" version

db-goto:
	@echo "Миграция к версии $(VERSION)..."
	migrate -path $(MIGRATIONS_PATH) -database "$(DB_URL)" goto $(VERSION)

db-drop:
	@echo "Удаление всех объектов из БД..."
	migrate -path $(MIGRATIONS_PATH) -database "$(DB_URL)" drop -f

db-force:
	@echo "Принудительная установка версии $(VERSION)..."
	migrate -path $(MIGRATIONS_PATH) -database "$(DB_URL)" force $(VERSION)

# Создание новой миграции
migrate-create:
	@read -p "Введите название миграции: " name; \
	migrate create -ext sql -dir $(MIGRATIONS_PATH) -seq $$name

# Посмотреть PID процесса на порту 5432
# sudo lsof -ti:5432
