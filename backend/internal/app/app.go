package app

import (
	"errors"
	"fmt"
	"log"

	"adboard/internal/config"
	"adboard/internal/handlers"
	"adboard/internal/middleware"
	"adboard/internal/models"
	"adboard/internal/repository"
	"adboard/internal/service"

	"github.com/labstack/echo/v4"
	echomiddleware "github.com/labstack/echo/v4/middleware"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type App struct {
	cfg  *config.Config
	echo *echo.Echo
	db   *gorm.DB
}

func NewApp(cfg *config.Config) *App {
	return &App{cfg: cfg}
}

func (a *App) InitDB() error {
	dsn := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable",
		a.cfg.DBHost, a.cfg.DBPort, a.cfg.DBUser, a.cfg.DBPassword, a.cfg.DBName)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		return fmt.Errorf("failed to connect to database: %w", err)
	}

	a.db = db
	return nil
}

func (a *App) RunMigrations() error {
	// Сначала удаляем представление и триггер, если они существуют
	a.db.Exec("DROP VIEW IF EXISTS ad_search_view")
	a.db.Exec("DROP TRIGGER IF EXISTS update_ads_updated_at ON ads")
	a.db.Exec("DROP TRIGGER IF EXISTS update_users_updated_at ON users")
	a.db.Exec("DROP FUNCTION IF EXISTS update_updated_at_column")

	// Auto migrate всех моделей
	err := a.db.AutoMigrate(
		&models.User{},
		&models.Category{},
		&models.Subcategory{},
		&models.Ad{},
		&models.AdImage{},
	)
	if err != nil {
		return fmt.Errorf("failed to run migrations: %w", err)
	}

	// Создаем функцию для триггера
	err = a.db.Exec(`
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = CURRENT_TIMESTAMP;
            RETURN NEW;
        END;
        $$ language 'plpgsql'
    `).Error
	if err != nil {
		return fmt.Errorf("failed to create trigger function: %w", err)
	}

	// Создаем триггер
	err = a.db.Exec(`
        CREATE TRIGGER update_ads_updated_at
            BEFORE UPDATE ON ads
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column()
    `).Error
	if err != nil {
		return fmt.Errorf("failed to create trigger: %w", err)
	}

	// Создаем представление
	err = a.db.Exec(`
        CREATE OR REPLACE VIEW ad_search_view AS
        SELECT
            a.id AS ad_id,
            a.title,
            a.description,
            c.name AS category_name,
            s.name AS subcategory_name
        FROM
            ads a
            JOIN subcategories s ON a.subcategory_id = s.id
            JOIN categories c ON s.category_id = c.id
    `).Error
	if err != nil {
		return fmt.Errorf("failed to create view: %w", err)
	}

	// Инициализируем базовые категории, если их нет
	err = a.initializeCategories()
	if err != nil {
		return fmt.Errorf("failed to initialize categories: %w", err)
	}

	return nil
}

func (a *App) InitEcho() {
	a.echo = echo.New()
	a.echo.Use(echomiddleware.Logger())
	a.echo.Use(echomiddleware.Recover())
	a.echo.Use(echomiddleware.CORS())

	// Serve uploaded images
	a.echo.Static("/images", a.cfg.UploadDir)
	a.SetupValidator()
}

func (a *App) RegisterRoutes() {
	// Initialize repositories, services, and handlers
	repo := repository.NewRepository(a.db)
	svc := service.NewService(repo, a.cfg)

	authHandler := handlers.NewAuthHandler(svc)
	userHandler := handlers.NewUserHandler(svc)
	categoryHandler := handlers.NewCategoryHandler(svc)
	itemHandler := handlers.NewItemHandler(svc)
	imageHandler := handlers.NewImageHandler(svc)

	// Public routes
	a.echo.POST("/register", authHandler.Register)
	a.echo.POST("/login", authHandler.Login)
	a.echo.GET("/categories", categoryHandler.GetCategories)
	a.echo.GET("/ads", itemHandler.SearchAds)
	a.echo.GET("/ads/:id", itemHandler.GetAd)

	// Protected routes
	protected := a.echo.Group("")
	protected.Use(middleware.JWTAuth(a.cfg))

	protected.GET("/profile", userHandler.GetProfile)
	protected.PUT("/profile", userHandler.UpdateProfile)

	protected.POST("/ads", itemHandler.CreateAd)
	protected.POST("/ads/with-images", itemHandler.CreateAdWithImages, middleware.UploadFiles)
	protected.GET("/my-ads", itemHandler.GetUserAds)
	protected.PUT("/ads/:id", itemHandler.UpdateAd)
	protected.DELETE("/ads/:id", itemHandler.DeleteAd)

	// Image routes with upload middleware
	protected.POST("/ads/:id/images", imageHandler.AddImages, middleware.UploadFiles)
	protected.DELETE("/images/:imageId", imageHandler.DeleteImage)
}

func (a *App) Start() error {
	addr := fmt.Sprintf(":%s", a.cfg.ServerPort)
	log.Printf("Server starting on %s", addr)
	return a.echo.Start(addr)
}

func (a *App) initializeCategories() error {
	// Проверяем, есть ли уже категории
	var count int64
	err := a.db.Model(&models.Category{}).Count(&count).Error
	if err != nil {
		return err
	}

	// Если категорий нет, то ошибка
	if count == 0 {
		return errors.New("no categories found")
	}

	return nil
}
