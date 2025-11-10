package repository

import (
	"errors"
	"strings"

	"adboard/internal/interfaces"
	"adboard/internal/models"

	"gorm.io/gorm"
)

type Repository struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) interfaces.Repository {
	return &Repository{db: db}
}

// User methods
func (r *Repository) CreateUser(user *models.User) error {
	return r.db.Create(user).Error
}

func (r *Repository) GetUserByEmail(email string) (*models.User, error) {
	var user models.User
	err := r.db.Where("email = ?", email).First(&user).Error
	return &user, err
}

func (r *Repository) GetUserByID(id uint) (*models.User, error) {
	var user models.User
	err := r.db.First(&user, id).Error
	return &user, err
}

func (r *Repository) UpdateUser(user *models.User) error {
	return r.db.Save(user).Error
}

// Category methods
func (r *Repository) GetCategories() ([]models.Category, error) {
	var categories []models.Category
	err := r.db.Preload("Subcategories").Find(&categories).Error
	return categories, err
}

// Ad methods
func (r *Repository) CreateAd(ad *models.Ad) error {
	return r.db.Create(ad).Error
}

func (r *Repository) GetAdByID(id uint) (*models.Ad, error) {
	var ad models.Ad
	err := r.db.Preload("User").Preload("Subcategory").Preload("Images").
		First(&ad, id).Error
	return &ad, err
}

func (r *Repository) GetUserAds(userID uint, page, limit int) ([]models.Ad, int64, error) {
	var ads []models.Ad
	var total int64

	offset := (page - 1) * limit

	err := r.db.Model(&models.Ad{}).Where("user_id = ?", userID).Count(&total).Error
	if err != nil {
		return nil, 0, err
	}

	err = r.db.Preload("Subcategory").Preload("Images").
		Where("user_id = ?", userID).
		Order("created_at DESC").
		Offset(offset).Limit(limit).
		Find(&ads).Error

	return ads, total, err
}

func (r *Repository) SearchAds(query string, categoryID, subcategoryID uint, page, limit int) ([]models.Ad, int64, error) {
	var ads []models.Ad
	var total int64

	offset := (page - 1) * limit
	dbQuery := r.db.Model(&models.Ad{}).Preload("User").Preload("Subcategory").Preload("Images")

	if query != "" {
		searchQuery := "%" + strings.ToLower(query) + "%"
		dbQuery = dbQuery.Where("LOWER(title) LIKE ? OR LOWER(description) LIKE ?", searchQuery, searchQuery)
	}

	// Если указана подкатегория, ищем только в ней
	if subcategoryID > 0 {
		dbQuery = dbQuery.Where("subcategory_id = ?", subcategoryID)
	} else if categoryID > 0 {
		// Если указана только категория, ищем по всем её подкатегориям
		dbQuery = dbQuery.Joins("JOIN subcategories ON ads.subcategory_id = subcategories.id").
			Where("subcategories.category_id = ?", categoryID)
	}

	err := dbQuery.Count(&total).Error
	if err != nil {
		return nil, 0, err
	}

	err = dbQuery.Order("created_at DESC, id DESC").
		Offset(offset).Limit(limit).
		Find(&ads).Error

	return ads, total, err
}

func (r *Repository) UpdateAd(ad *models.Ad) error {
	return r.db.Save(ad).Error
}

func (r *Repository) DeleteAd(id uint) error {
	return r.db.Transaction(func(tx *gorm.DB) error {
		// Delete associated images first
		if err := tx.Where("ad_id = ?", id).Delete(&models.AdImage{}).Error; err != nil {
			return err
		}
		// Then delete the ad
		return tx.Delete(&models.Ad{}, id).Error
	})
}

func (r *Repository) AddAdImages(images []models.AdImage) error {
	return r.db.Create(&images).Error
}

func (r *Repository) GetAdImageCount(adID uint) (int64, error) {
	var count int64
	err := r.db.Model(&models.AdImage{}).Where("ad_id = ?", adID).Count(&count).Error
	return count, err
}

func (r *Repository) DeleteAdImage(id uint) error {
	return r.db.Delete(&models.AdImage{}, id).Error
}

func (r *Repository) GetAdImageByID(id uint) (*models.AdImage, error) {
	var image models.AdImage
	err := r.db.First(&image, id).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("image not found") // Лучше возвращать кастомную ошибку
		}
		return nil, err // Возвращаем настоящую ошибку gorm
	}
	return &image, nil
}

func (r *Repository) CreateAdWithImages(ad *models.Ad, imagePaths []string) error {
	return r.db.Transaction(func(tx *gorm.DB) error {
		// Создаем объявление
		if err := tx.Create(ad).Error; err != nil {
			return err
		}

		// Если есть изображения, создаем их
		if len(imagePaths) > 0 {
			if len(imagePaths) > 7 {
				return errors.New("cannot add more than 7 images to an ad")
			}

			images := make([]models.AdImage, len(imagePaths))
			for i, path := range imagePaths {
				images[i] = models.AdImage{
					AdID:       ad.ID,
					FilePath:   path,
					OrderIndex: i + 1,
				}
			}

			if err := tx.Create(&images).Error; err != nil {
				return err
			}
		}

		return nil
	})
}
