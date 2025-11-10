package interfaces

import "adboard/internal/models"

type Repository interface {
	// User methods
	CreateUser(user *models.User) error
	GetUserByEmail(email string) (*models.User, error)
	GetUserByID(id uint) (*models.User, error)
	UpdateUser(user *models.User) error

	// Category methods
	GetCategories() ([]models.Category, error)

	// Ad methods
	CreateAd(ad *models.Ad) error
	GetAdByID(id uint) (*models.Ad, error)
	GetUserAds(userID uint, page, limit int) ([]models.Ad, int64, error)
	SearchAds(query string, categoryID, subcategoryID uint, page, limit int) ([]models.Ad, int64, error)
	UpdateAd(ad *models.Ad) error
	DeleteAd(id uint) error

	// Image methods
	AddAdImages(images []models.AdImage) error
	GetAdImageCount(adID uint) (int64, error)
	DeleteAdImage(id uint) error
	GetAdImageByID(id uint) (*models.AdImage, error)

	// Complex operations
	CreateAdWithImages(ad *models.Ad, imagePaths []string) error
}
