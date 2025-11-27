package service

import (
	"errors"

	"adboard/internal/interfaces"
	"adboard/internal/models"
)

type ImageService struct {
	repo   interfaces.ImageRepository
	adRepo interfaces.AdRepository
}

func NewImageService(repo interfaces.ImageRepository, adRepo interfaces.AdRepository) *ImageService {
	return &ImageService{repo: repo, adRepo: adRepo}
}

func (s *ImageService) AddAdImages(adID, userID uint, imagePaths []string) error {
	ad, err := s.adRepo.GetAdByID(adID)
	if err != nil {
		return errors.New("ad not found")
	}

	if ad.UserID != userID {
		return errors.New("unauthorized to add images to this ad")
	}

	currentCount, err := s.repo.GetAdImageCount(adID)
	if err != nil {
		return err
	}

	if currentCount+int64(len(imagePaths)) > 7 {
		return errors.New("cannot add more than 7 images to an ad")
	}

	images := make([]models.AdImage, len(imagePaths))
	for i, path := range imagePaths {
		images[i] = models.AdImage{
			AdID:       adID,
			FilePath:   path,
			OrderIndex: int(currentCount) + i + 1,
		}
	}

	return s.repo.AddAdImages(images)
}

func (s *ImageService) DeleteAdImage(imageID, userID uint) error {
	var image *models.AdImage
	image, err := s.repo.GetAdImageByID(imageID)
	if err != nil {
		return errors.New("image not found")
	}

	ad, err := s.adRepo.GetAdByID(image.AdID)
	if err != nil {
		return errors.New("ad not found")
	}

	if ad.UserID != userID {
		return errors.New("unauthorized to delete this image")
	}

	return s.repo.DeleteAdImage(imageID)
}
