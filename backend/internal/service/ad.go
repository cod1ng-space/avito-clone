package service

import (
	"errors"

	"adboard/internal/interfaces"
	"adboard/internal/models"
)

type AdService struct {
	repo interfaces.AdRepository
}

func NewAdService(repo interfaces.AdRepository) *AdService {
	return &AdService{repo: repo}
}

func (s *AdService) CreateAd(ad *models.Ad) error {
	return s.repo.CreateAd(ad)
}

func (s *AdService) GetAdByID(id uint) (*models.Ad, error) {
	return s.repo.GetAdByID(id)
}

func (s *AdService) GetUserAds(userID uint, page, limit int) ([]models.Ad, int64, error) {
	if page < 1 {
		page = 1
	}
	if limit < 1 {
		limit = 12
	}
	return s.repo.GetUserAds(userID, page, limit)
}

func (s *AdService) SearchAds(query string, categoryID, subcategoryID uint, page, limit int) ([]models.Ad, int64, error) {
	if page < 1 {
		page = 1
	}
	if limit < 1 {
		limit = 12
	}
	return s.repo.SearchAds(query, categoryID, subcategoryID, page, limit)
}

func (s *AdService) UpdateAd(adID, userID uint, updateData *models.AdUpdateRequest) error {
	ad, err := s.repo.GetAdByID(adID)
	if err != nil {
		return errors.New("ad not found")
	}

	if ad.UserID != userID {
		return errors.New("unauthorized to update this ad")
	}

	if updateData.Title != "" {
		ad.Title = updateData.Title
	}
	if updateData.Description != "" {
		ad.Description = updateData.Description
	}
	if updateData.SubcategoryID > 0 {
		ad.SubcategoryID = updateData.SubcategoryID
		ad.Subcategory = models.Subcategory{}
	}

	return s.repo.UpdateAd(ad)
}

func (s *AdService) DeleteAd(adID, userID uint) error {
	ad, err := s.repo.GetAdByID(adID)
	if err != nil {
		return errors.New("ad not found")
	}

	if ad.UserID != userID {
		return errors.New("unauthorized to delete this ad")
	}

	return s.repo.DeleteAd(adID)
}

func (s *AdService) CreateAdWithImages(ad *models.Ad, imagePaths []string) error {
	// Создаем объявление и изображения в одной транзакции
	return s.repo.CreateAdWithImages(ad, imagePaths)
}
