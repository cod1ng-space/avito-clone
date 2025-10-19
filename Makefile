# Avito Clone Project Makefile
.PHONY: help install setup-db start stop clean build test dev db-reset logs docker-up docker-down docker-build

# Default command
help:
	@echo "Доступные команды:"
	@echo "  install      - Установить зависимости для фронтенда и бэкенда"
	@echo "  setup-db     - Создать базу данных и применить миграции"
	@echo "  start        - Запустить полный проект (бэкенд + фронтенд)"
	@echo "  dev          - Запустить в режиме разработки"
	@echo "  dev-backend  - Запустить только бэкенд"
	@echo "  dev-frontend - Запустить только фронтенд"
	@echo "  build        - Собрать проект"
	@echo "  stop         - Остановить все процессы"
	@echo "  clean        - Очистить временные файлы"
	@echo "  test         - Запустить тесты"
	@echo "  db-reset     - Пересоздать базу данных"
	@echo "  logs         - Показать логи"
	@echo ""
	@echo "Миграции:"
	@echo "  migrate-up   - Применить все миграции"
	@echo "  migrate-down - Откатить одну миграцию"
	@echo "  migrate-drop - Удалить все таблицы"
	@echo "  migrate-new  - Создать новую миграцию"
	@echo "  migrate-version - Показать версию миграции"
	@echo "  migrate-force   - Принудительно исправить версию миграции"
	@echo ""
	@echo "Docker команды:"
	@echo "  docker-up    - Запустить проект в Docker"
	@echo "  docker-down  - Остановить Docker контейнеры"
	@echo "  docker-build - Пересобрать Docker образы"

# Переменные
DB_NAME=db-omega
DB_USER=postgres
BACKEND_PORT=8080
FRONTEND_PORT=3000
MIGRATE_PATH=backend/migrations
DATABASE_URL=postgres://$(DB_USER):postgre@localhost:5432/$(DB_NAME)?sslmode=disable

# Установка зависимостей
install:
	@echo "📦 Установка зависимостей..."
	cd frontend && npm install
	cd backend && go mod download && go mod tidy

# Настройка базы данных
setup-db:
	@echo "🗄️ Настройка базы данных..."
	@sudo -u postgres psql -c "DROP DATABASE IF EXISTS $(DB_NAME);" 2>/dev/null || true
	@sudo -u postgres psql -c "CREATE DATABASE \"$(DB_NAME)\";"
	@sudo -u postgres psql -d $(DB_NAME) -f backend/sql/schema.sql
	@sudo -u postgres psql -d $(DB_NAME) -f backend/sql/categories.sql
	@echo "✅ База данных настроена"

# Сборка проекта
build:
	@echo "🔨 Сборка проекта..."
	cd backend && go build -o bin/server ./cmd/server
	cd frontend && npm run build
	@echo "✅ Проект собран"

# Запуск в продакшен режиме
start: build
	@echo "🚀 Запуск проекта..."
	@pkill -f "bin/server" 2>/dev/null || true
	@pkill -f "serve -s build" 2>/dev/null || true
	cd backend && ./bin/server &
	@echo "⏳ Ожидание запуска бэкенда..."
	@sleep 3
	cd frontend && npx serve -s build -l $(FRONTEND_PORT) &
	@echo "✅ Проект запущен:"
	@echo "   - Бэкенд: http://localhost:$(BACKEND_PORT)"
	@echo "   - Фронтенд: http://localhost:$(FRONTEND_PORT)"

# Запуск в режиме разработки
dev:
	@echo "🛠️ Запуск в режиме разработки..."
	@echo "Запуск бэкенда в фоне..."
	@cd backend && nohup go run ./cmd/server/main.go > ../backend.log 2>&1 &
	@sleep 3
	@echo "Запуск фронтенда..."
	@cd frontend && npm start
	@echo "✅ Режим разработки запущен:"
	@echo "   - Бэкенд: http://localhost:$(BACKEND_PORT)"
	@echo "   - Фронтенд: http://localhost:$(FRONTEND_PORT)"

# Запуск только бэкенда
dev-backend:
	@echo "🛠️ Запуск бэкенда..."
	@pkill -f "go run.*main.go" 2>/dev/null || true
	@cd backend && go run ./cmd/server/main.go

# Запуск только фронтенда
dev-frontend:
	@echo "🛠️ Запуск фронтенда..."
	@pkill -f "react-scripts start" 2>/dev/null || true
	@cd frontend && npm start

# Остановка всех процессов
stop:
	@echo "🛑 Остановка проекта..."
	@pkill -f "bin/server" 2>/dev/null || true
	@pkill -f "go run.*main.go" 2>/dev/null || true
	@pkill -f "react-scripts start" 2>/dev/null || true
	@pkill -f "serve -s build" 2>/dev/null || true
	@echo "✅ Проект остановлен"

# Очистка временных файлов
clean:
	@echo "🧹 Очистка временных файлов..."
	cd backend && rm -rf bin/ tmp/
	cd frontend && rm -rf build/ node_modules/.cache
	@echo "✅ Очистка завершена"

# Тесты
test:
	@echo "🧪 Запуск тестов..."
	cd backend && go test ./...
	cd frontend && npm test -- --coverage --watchAll=false
	@echo "✅ Тесты завершены"

# Полная перенастройка базы данных
db-reset: setup-db
	@echo "🔄 База данных перенастроена"

# Показать логи процессов
logs:
	@echo "📋 Активные процессы проекта:"
	@ps aux | grep -E "(bin/server|go run.*main.go|react-scripts|serve.*build)" | grep -v grep || echo "Нет активных процессов"

# Проверка системных требований
check-deps:
	@echo "🔍 Проверка системных зависимостей..."
	@command -v go >/dev/null 2>&1 || { echo "❌ Go не установлен"; exit 1; }
	@command -v node >/dev/null 2>&1 || { echo "❌ Node.js не установлен"; exit 1; }
	@command -v npm >/dev/null 2>&1 || { echo "❌ npm не установлен"; exit 1; }
	@command -v psql >/dev/null 2>&1 || { echo "❌ PostgreSQL не установлен"; exit 1; }
	@systemctl is-active --quiet postgresql || { echo "❌ PostgreSQL не запущен"; exit 1; }
	@echo "✅ Все зависимости в порядке"

# Быстрый старт проекта
quick-start: check-deps install setup-db dev
	@echo "🎉 Проект готов к работе!"

# Создание директории для загрузок
create-uploads:
	@mkdir -p backend/uploads/images
	@chmod 755 backend/uploads/images
	@echo "✅ Директория для загрузок создана"

# Полная установка с нуля
full-setup: check-deps install create-uploads setup-db
	@echo "🎉 Полная установка завершена! Используйте 'make dev' для запуска"

# Docker команды
docker-up:
	@echo "🐳 Запуск проекта в Docker..."
	docker-compose up -d
	@echo "✅ Проект запущен в Docker:"
	@echo "   - Фронтенд: http://localhost:3000"
	@echo "   - Бэкенд: http://localhost:8080"
	@echo "   - База данных: localhost:5432"

docker-down:
	@echo "🐳 Остановка Docker контейнеров..."
	docker-compose down
	@echo "✅ Docker контейнеры остановлены"

docker-build:
	@echo "🐳 Пересборка Docker образов..."
	docker-compose build --no-cache
	@echo "✅ Docker образы пересобраны"

docker-logs:
	@echo "📋 Логи Docker контейнеров:"
	docker-compose logs -f

# Команды для миграций с go-migrate CLI
migrate-up:
	@echo "🔄 Применение всех миграций..."
	@cd backend && migrate -path migrations -database "$(DATABASE_URL)" up
	@echo "✅ Миграции применены"

migrate-down:
	@echo "↩️ Откат последней миграции..."
	@cd backend && migrate -path migrations -database "$(DATABASE_URL)" down 1
	@echo "✅ Миграция откачена"

migrate-drop:
	@echo "🗑️ Удаление всех таблиц..."
	@cd backend && migrate -path migrations -database "$(DATABASE_URL)" drop -f
	@echo "✅ Все таблицы удалены"

migrate-version:
	@echo "📊 Текущая версия миграции:"
	@cd backend && migrate -path migrations -database "$(DATABASE_URL)" version

migrate-force:
	@echo "🔧 Принудительное исправление версии миграции..."
	@read -p "Введите версию для исправления: " version; \
	cd backend && migrate -path migrations -database "$(DATABASE_URL)" force $$version
	@echo "✅ Версия миграции исправлена"

migrate-new:
	@echo "📝 Создание новой миграции..."
	@read -p "Введите название миграции: " name; \
	cd backend && migrate create -ext sql -dir migrations -seq $$name
	@echo "✅ Новая миграция создана"

# Создание базы данных и применение миграций
db-create:
	@echo "🗄️ Создание базы данных..."
	@sudo -u postgres psql -c "DROP DATABASE IF EXISTS $(DB_NAME);" 2>/dev/null || true
	@sudo -u postgres psql -c "CREATE DATABASE \"$(DB_NAME)\";"
	@echo "✅ База данных создана"

# Настройка базы данных с миграциями
setup-db-migrate: db-create migrate-up
	@echo "✅ База данных настроена с помощью миграций"