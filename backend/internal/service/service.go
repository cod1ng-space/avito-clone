package service

import (
	"errors"
	"fmt"
	"time"

	"adboard/internal/config"
	"adboard/internal/models"
	"adboard/internal/repository"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

type Service struct {
	repo *repository.Repository
	cfg  *config.Config
}

func NewService(repo *repository.Repository, cfg *config.Config) *Service {
	return &Service{repo: repo, cfg: cfg}
}

func (s *Service) RegisterUser(user *models.User) error {
	// Check if user already exists
	existingUser, err := s.repo.GetUserByEmail(user.Email)
	if err == nil && existingUser != nil {
		return errors.New("user with this email already exists")
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.PasswordHash), bcrypt.DefaultCost)
	if err != nil {
		return fmt.Errorf("failed to hash password: %w", err)
	}
	user.PasswordHash = string(hashedPassword)

	// Create user
	return s.repo.CreateUser(user)
}

func (s *Service) LoginUser(email, password string) (string, error) {
	// Get user by email
	user, err := s.repo.GetUserByEmail(email)
	if err != nil {
		return "", errors.New("invalid credentials")
	}

	// Check password
	err = bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(password))
	if err != nil {
		return "", errors.New("invalid credentials")
	}

	// Generate JWT token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": user.ID,
		"email":   user.Email,
		"exp":     time.Now().Add(time.Hour * 72).Unix(),
	})

	tokenString, err := token.SignedString([]byte(s.cfg.JWTSecret))
	if err != nil {
		return "", fmt.Errorf("failed to generate token: %w", err)
	}

	return tokenString, nil
}

func (s *Service) GetUserProfile(userID uint) (*models.User, error) {
	return s.repo.GetUserByID(userID)
}

func (s *Service) UpdateUserProfile(userID uint, updateData *models.UserUpdateRequest) error {
	user, err := s.repo.GetUserByID(userID)
	if err != nil {
		return errors.New("user not found")
	}

	if updateData.Username != "" {
		user.Username = updateData.Username
	}
	if updateData.Phone != "" {
		user.Phone = updateData.Phone
	}
	if updateData.SocialNetwork != nil {
		user.SocialNetwork = updateData.SocialNetwork
	}
	if updateData.SocialContact != nil {
		user.SocialContact = updateData.SocialContact
	}

	return s.repo.UpdateUser(user)
}

func (s *Service) GetCategories() ([]models.Category, error) {
	return s.repo.GetCategories()
}

func (s *Service) CreateAd(ad *models.Ad) error {
	return s.repo.CreateAd(ad)
}

func (s *Service) GetAdByID(id uint) (*models.Ad, error) {
	return s.repo.GetAdByID(id)
}

func (s *Service) GetUserAds(userID uint, page, limit int) ([]models.Ad, int64, error) {
	if page < 1 {
		page = 1
	}
	if limit < 1 {
		limit = 10
	}
	return s.repo.GetUserAds(userID, page, limit)
}

func (s *Service) SearchAds(query string, categoryID uint, page, limit int) ([]models.Ad, int64, error) {
	if page < 1 {
		page = 1
	}
	if limit < 1 {
		limit = 10
	}
	return s.repo.SearchAds(query, categoryID, page, limit)
}

func (s *Service) UpdateAd(adID, userID uint, updateData *models.AdUpdateRequest) error {
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
	}

	return s.repo.UpdateAd(ad)
}

func (s *Service) DeleteAd(adID, userID uint) error {
	ad, err := s.repo.GetAdByID(adID)
	if err != nil {
		return errors.New("ad not found")
	}

	if ad.UserID != userID {
		return errors.New("unauthorized to delete this ad")
	}

	return s.repo.DeleteAd(adID)
}

func (s *Service) AddAdImages(adID, userID uint, imagePaths []string) error {
	ad, err := s.repo.GetAdByID(adID)
	if err != nil {
		return errors.New("ad not found")
	}

	if ad.UserID != userID {
		return errors.New("unauthorized to add images to this ad")
	}

	// Check current image count
	currentCount, err := s.repo.GetAdImageCount(adID)
	if err != nil {
		return err
	}

	if currentCount+int64(len(imagePaths)) > 7 {
		return errors.New("cannot add more than 7 images to an ad")
	}

	// Create image records
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

func (s *Service) DeleteAdImage(imageID, userID uint) error {
	// Get image to check ownership
	var image *models.AdImage
	image, err := s.repo.GetAdImageByID(imageID)
	if err != nil {
		return errors.New("image not found")
	}

	// Get ad to check ownership
	ad, err := s.repo.GetAdByID(image.AdID)
	if err != nil {
		return errors.New("ad not found")
	}

	if ad.UserID != userID {
		return errors.New("unauthorized to delete this image")
	}

	return s.repo.DeleteAdImage(imageID)
}
