package handlers

import (
	"net/http"
	"strconv"

	"adboard/internal/interfaces"
	"adboard/internal/middleware"

	"github.com/labstack/echo/v4"
)

type ImageHandler struct {
	service interfaces.Service
}

func NewImageHandler(service interfaces.Service) interfaces.ImageHandler {
	return &ImageHandler{service: service}
}

func (h *ImageHandler) AddImages(c echo.Context) error {
	userID := middleware.GetUserID(c)

	adID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Invalid ad ID")
	}

	uploadedFiles, ok := c.Get("uploadedFiles").([]string)
	if !ok {
		return echo.NewHTTPError(http.StatusBadRequest, "No files uploaded")
	}

	if err := h.service.AddAdImages(uint(adID), userID, uploadedFiles); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}

	return c.JSON(http.StatusOK, map[string]string{
		"message": "Images added successfully",
	})
}

func (h *ImageHandler) DeleteImage(c echo.Context) error {
	userID := middleware.GetUserID(c)

	imageID, err := strconv.Atoi(c.Param("imageId"))
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Invalid image ID")
	}

	if err := h.service.DeleteAdImage(uint(imageID), userID); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}

	return c.JSON(http.StatusOK, map[string]string{
		"message": "Image deleted successfully",
	})
}
