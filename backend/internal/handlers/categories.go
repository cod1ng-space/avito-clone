package handlers

import (
	"net/http"

	"adboard/internal/service"

	"github.com/labstack/echo/v4"
)

type CategoryHandler struct {
	categoryService *service.CategoryService
}

func NewCategoryHandler(categoryService *service.CategoryService) *CategoryHandler {
	return &CategoryHandler{categoryService: categoryService}
}

func (h *CategoryHandler) GetCategories(c echo.Context) error {
	categories, err := h.categoryService.GetCategories()
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
	}

	return c.JSON(http.StatusOK, categories)
}
