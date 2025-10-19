package main

import (
	"log"

	"adboard/internal/app"
	"adboard/internal/config"

	"github.com/joho/godotenv"
)

func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using environment variables")
	}

	// Load configuration
	cfg := config.Load()

	// Initialize application
	application := app.NewApp(cfg)

	// Initialize database
	if err := application.InitDB(); err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}

	// Run migrations
	if err := application.RunMigrations(); err != nil {
		log.Fatalf("Failed to run migrations: %v", err)
	}

	// Initialize Echo
	application.InitEcho()

	// Register routes
	application.RegisterRoutes()

	// Start server
	if err := application.Start(); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
