package interfaces

import "adboard/internal/models"

type AuthRepository interface {
	CreateUser(user *models.User) error
	GetUserByEmail(email string) (*models.User, error)
}

type UserRepository interface {
	GetUserByID(id uint) (*models.User, error)
	UpdateUser(user *models.User) error
	GetUserByEmail(email string) (*models.User, error)
}

type CategoryRepository interface {
	GetCategories() ([]models.Category, error)
}

type AdRepository interface {
	CreateAd(ad *models.Ad) error
	GetAdByID(id uint) (*models.Ad, error)
	GetUserAds(userID uint, page, limit int) ([]models.Ad, int64, error)
	SearchAds(query string, categoryID, subcategoryID uint, page, limit int) ([]models.Ad, int64, error)
	UpdateAd(ad *models.Ad) error
	DeleteAd(id uint) error

	CreateAdWithImages(ad *models.Ad, imagePaths []string) error
}

type ImageRepository interface {
	AddAdImages(images []models.AdImage) error
	GetAdImageCount(adID uint) (int64, error)
	DeleteAdImage(id uint) error
	GetAdImageByID(id uint) (*models.AdImage, error)
}
