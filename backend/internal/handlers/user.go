package handlers

import (
	"net/http"

	"adboard/internal/middleware"
	"adboard/internal/models"
	"adboard/internal/service"

	"github.com/labstack/echo/v4"
)

type UserHandler struct {
	userService *service.UserService
}

func NewUserHandler(userService *service.UserService) *UserHandler {
	return &UserHandler{userService: userService}
}

func (h *UserHandler) GetProfile(c echo.Context) error {
	userID := middleware.GetUserID(c)

	user, err := h.userService.GetUserProfile(userID)
	if err != nil {
		return echo.NewHTTPError(http.StatusNotFound, err.Error())
	}

	return c.JSON(http.StatusOK, user)
}

func (h *UserHandler) UpdateProfile(c echo.Context) error {
	userID := middleware.GetUserID(c)

	var req models.UserUpdateRequest
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Invalid request payload")
	}

	if err := c.Validate(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}

	if err := h.userService.UpdateUserProfile(userID, &req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}

	return c.JSON(http.StatusOK, map[string]string{
		"message": "Profile updated successfully",
	})
}
