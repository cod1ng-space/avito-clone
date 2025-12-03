package repository

import (
	"strings"

	"adboard/internal/interfaces"
	"adboard/internal/models"

	"gorm.io/gorm"
)

type AdRepository struct {
	db *gorm.DB
}

func NewAdRepository(db *gorm.DB) interfaces.AdRepository {
	return &AdRepository{db: db}
}

func (r *AdRepository) CreateAd(ad *models.Ad) error {
	return r.db.Create(ad).Error
}

func (r *AdRepository) GetAdByID(id uint) (*models.Ad, error) {
	var ad models.Ad
	err := r.db.Preload("User").Preload("Subcategory").Preload("Images").
		First(&ad, id).Error
	return &ad, err
}

func (r *AdRepository) GetUserAds(userID uint, page, limit int) ([]models.Ad, int64, error) {
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

func (r *AdRepository) SearchAds(query string, categoryID, subcategoryID uint, page, limit int) ([]models.Ad, int64, error) {
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

func (r *AdRepository) UpdateAd(ad *models.Ad) error {
	return r.db.Save(ad).Error
}

func (r *AdRepository) DeleteAd(id uint) error {
	return r.db.Transaction(func(tx *gorm.DB) error {
		if err := tx.Where("ad_id = ?", id).Delete(&models.AdImage{}).Error; err != nil {
			return err
		}
		return tx.Delete(&models.Ad{}, id).Error
	})
}

func (r *AdRepository) CreateAdWithImages(ad *models.Ad, imagePaths []string) error {
	return r.db.Transaction(func(tx *gorm.DB) error {
		// Создаем объявление
		if err := tx.Create(ad).Error; err != nil {
			return err
		}

		// Если есть изображения, создаем их
		if len(imagePaths) > 0 {
			if len(imagePaths) > 7 {
				return gorm.ErrInvalidTransaction
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
