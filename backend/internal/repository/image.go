package repository

import (
	"errors"

	"adboard/internal/interfaces"
	"adboard/internal/models"

	"gorm.io/gorm"
)

type ImageRepository struct {
	db *gorm.DB
}

func NewImageRepository(db *gorm.DB) interfaces.ImageRepository {
	return &ImageRepository{db: db}
}

func (r *ImageRepository) AddAdImages(images []models.AdImage) error {
	return r.db.Create(&images).Error
}

func (r *ImageRepository) GetAdImageCount(adID uint) (int64, error) {
	var count int64
	err := r.db.Model(&models.AdImage{}).Where("ad_id = ?", adID).Count(&count).Error
	return count, err
}

func (r *ImageRepository) DeleteAdImage(id uint) error {
	return r.db.Delete(&models.AdImage{}, id).Error
}

func (r *ImageRepository) GetAdImageByID(id uint) (*models.AdImage, error) {
	var image models.AdImage
	err := r.db.First(&image, id).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("image not found")
		}
		return nil, err
	}
	return &image, nil
}
