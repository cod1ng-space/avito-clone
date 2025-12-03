package interfaces

import "adboard/internal/models"

type AuthService interface {
	RegisterUser(user *models.User) error
	LoginUser(email, password string) (string, error)
}

type UserService interface {
	GetUserProfile(userID uint) (*models.User, error)
	UpdateUserProfile(userID uint, updateData *models.UserUpdateRequest) error
}

type CategoryService interface {
	GetCategories() ([]models.Category, error)
}

type AdService interface {
	CreateAd(ad *models.Ad) error
	GetAdByID(id uint) (*models.Ad, error)
	GetUserAds(userID uint, page, limit int) ([]models.Ad, int64, error)
	SearchAds(query string, categoryID, subcategoryID uint, page, limit int) ([]models.Ad, int64, error)
	UpdateAd(adID, userID uint, updateData *models.AdUpdateRequest) error
	DeleteAd(adID, userID uint) error

	CreateAdWithImages(ad *models.Ad, imagePaths []string) error
}

type ImageService interface {
	AddAdImages(adID, userID uint, imagePaths []string) error
	DeleteAdImage(imageID, userID uint) error
}
