package service

import (
	"errors"

	"adboard/internal/interfaces"
	"adboard/internal/models"
)

type UserService struct {
	repo     interfaces.UserRepository
	authRepo interfaces.AuthRepository
}

func NewUserService(repo interfaces.UserRepository, authRepo interfaces.AuthRepository) *UserService {
	return &UserService{repo: repo, authRepo: authRepo}
}

func (s *UserService) GetUserProfile(userID uint) (*models.User, error) {
	return s.repo.GetUserByID(userID)
}

func (s *UserService) UpdateUserProfile(userID uint, updateData *models.UserUpdateRequest) error {
	user, err := s.repo.GetUserByID(userID)
	if err != nil {
		return errors.New("user not found")
	}

	// Проверка на уникальность email, если он обновляется
	if updateData.Email != "" && updateData.Email != user.Email {
		// Проверяем, существует ли уже пользователь с таким email
		_, err := s.authRepo.GetUserByEmail(updateData.Email)
		if err == nil {
			// Пользователь с таким email уже существует
			return errors.New("email already exists")
		}
		user.Email = updateData.Email
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
