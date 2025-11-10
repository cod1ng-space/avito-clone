package handlers

import (
	"net/http"

	"adboard/internal/interfaces"

	"github.com/labstack/echo/v4"
)

type CategoryHandler struct {
	service interfaces.Service
}

func NewCategoryHandler(service interfaces.Service) interfaces.CategoryHandler {
	return &CategoryHandler{service: service}
}

func (h *CategoryHandler) GetCategories(c echo.Context) error {
	categories, err := h.service.GetCategories()
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
	}

	return c.JSON(http.StatusOK, categories)
}
