package repository

import (
	"adboard/internal/interfaces"
	"adboard/internal/models"

	"gorm.io/gorm"
)

type CategoryRepository struct {
	db *gorm.DB
}

func NewCategoryRepository(db *gorm.DB) interfaces.CategoryRepository {
	return &CategoryRepository{db: db}
}

func (r *CategoryRepository) GetCategories() ([]models.Category, error) {
	var categories []models.Category
	err := r.db.Preload("Subcategories").Find(&categories).Error
	return categories, err
}
