package handlers

import (
	"fmt"
	"net/http"

	"adboard/internal/models"
	"adboard/internal/service"

	"github.com/go-playground/validator/v10"
	"github.com/labstack/echo/v4"
)

type AuthHandler struct {
	service *service.Service
}

func NewAuthHandler(service *service.Service) *AuthHandler {
	return &AuthHandler{service: service}
}

func (h *AuthHandler) Register(c echo.Context) error {
	var req models.AuthRequest
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Invalid request payload")
	}

	// Валидация запроса
	if err := c.Validate(&req); err != nil {
		validationErrors := err.(validator.ValidationErrors)
		errorMessage := "Validation failed: "
		for _, e := range validationErrors {
			switch e.Tag() {
			case "required":
				errorMessage += fmt.Sprintf("%s is required; ", e.Field())
			case "email":
				errorMessage += fmt.Sprintf("%s must be a valid email; ", e.Field())
			case "min":
				errorMessage += fmt.Sprintf("%s must be at least %s characters; ", e.Field(), e.Param())
			}
		}
		return echo.NewHTTPError(http.StatusBadRequest, errorMessage)
	}

	user := &models.User{
		Email:        req.Email,
		PasswordHash: req.Password,
		Username:     req.Email, // Default to email, can be changed later
	}

	if err := h.service.RegisterUser(user); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}

	return c.JSON(http.StatusCreated, map[string]string{
		"message": "User registered successfully",
	})
}

func (h *AuthHandler) Login(c echo.Context) error {
	var req models.AuthRequest
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Invalid request payload")
	}

	if err := c.Validate(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}

	token, err := h.service.LoginUser(req.Email, req.Password)
	if err != nil {
		return echo.NewHTTPError(http.StatusUnauthorized, err.Error())
	}

	return c.JSON(http.StatusOK, map[string]string{
		"token": token,
	})
}
