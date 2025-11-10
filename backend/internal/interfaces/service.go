package interfaces

import "adboard/internal/models"

type Service interface {
	// User methods
	RegisterUser(user *models.User) error
	LoginUser(email, password string) (string, error)
	GetUserProfile(userID uint) (*models.User, error)
	UpdateUserProfile(userID uint, updateData *models.UserUpdateRequest) error

	// Category methods
	GetCategories() ([]models.Category, error)

	// Ad methods
	CreateAd(ad *models.Ad) error
	GetAdByID(id uint) (*models.Ad, error)
	GetUserAds(userID uint, page, limit int) ([]models.Ad, int64, error)
	SearchAds(query string, categoryID, subcategoryID uint, page, limit int) ([]models.Ad, int64, error)
	UpdateAd(adID, userID uint, updateData *models.AdUpdateRequest) error
	DeleteAd(adID, userID uint) error

	// Image methods
	AddAdImages(adID, userID uint, imagePaths []string) error
	DeleteAdImage(imageID, userID uint) error

	// Complex operations
	CreateAdWithImages(ad *models.Ad, imagePaths []string) error
}
