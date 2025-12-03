package service

import (
	"adboard/internal/interfaces"
	"adboard/internal/models"
)

type CategoryService struct {
	repo interfaces.CategoryRepository
}

func NewCategoryService(repo interfaces.CategoryRepository) *CategoryService {
	return &CategoryService{repo: repo}
}

func (s *CategoryService) GetCategories() ([]models.Category, error) {
	return s.repo.GetCategories()
}
