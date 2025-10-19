package handlers

import (
	"net/http"
	"strconv"

	"adboard/internal/middleware"
	"adboard/internal/models"
	"adboard/internal/service"

	"github.com/labstack/echo/v4"
)

type ItemHandler struct {
	service *service.Service
}

func NewItemHandler(service *service.Service) *ItemHandler {
	return &ItemHandler{service: service}
}

func (h *ItemHandler) CreateAd(c echo.Context) error {
	userID := middleware.GetUserID(c)

	var req models.AdCreateRequest
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Invalid request payload")
	}

	if err := c.Validate(&req); err != nil {
		// Улучшенное сообщение об ошибке валидации
		return echo.NewHTTPError(http.StatusBadRequest, map[string]string{
			"message": "Ошибка валидации данных",
			"error":   err.Error(),
		})
	}

	ad := &models.Ad{
		Title:         req.Title,
		Description:   req.Description,
		UserID:        userID,
		SubcategoryID: req.SubcategoryID,
	}

	if err := h.service.CreateAd(ad); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}

	return c.JSON(http.StatusCreated, ad)
}

func (h *ItemHandler) GetAd(c echo.Context) error {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, map[string]string{
			"message": "Неверный ID объявления",
			"error":   err.Error(),
		})
	}

	ad, err := h.service.GetAdByID(uint(id))
	if err != nil {
		return echo.NewHTTPError(http.StatusNotFound, map[string]string{
			"message": "Объявление не найдено",
			"error":   err.Error(),
		})
	}

	return c.JSON(http.StatusOK, ad)
}

func (h *ItemHandler) GetUserAds(c echo.Context) error {
	userID := middleware.GetUserID(c)

	page, _ := strconv.Atoi(c.QueryParam("page"))
	if page < 1 {
		page = 1
	}

	limit, _ := strconv.Atoi(c.QueryParam("limit"))
	if limit < 1 {
		limit = 10
	}

	ads, total, err := h.service.GetUserAds(userID, page, limit)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"ads":   ads,
		"total": total,
		"page":  page,
		"limit": limit,
	})
}

func (h *ItemHandler) SearchAds(c echo.Context) error {
	query := c.QueryParam("q")
	categoryStr := c.QueryParam("category")
	page, _ := strconv.Atoi(c.QueryParam("page"))
	limit, _ := strconv.Atoi(c.QueryParam("limit"))

	if page < 1 {
		page = 1
	}
	if limit < 1 {
		limit = 10
	}

	var categoryID uint
	if categoryStr != "" {
		catID, err := strconv.ParseUint(categoryStr, 10, 0)
		if err != nil {
			return echo.NewHTTPError(http.StatusBadRequest, "Invalid category ID")
		}
		categoryID = uint(catID)
	}

	ads, total, err := h.service.SearchAds(query, categoryID, page, limit)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"ads":   ads,
		"total": total,
		"page":  page,
		"limit": limit,
	})
}

func (h *ItemHandler) UpdateAd(c echo.Context) error {
	userID := middleware.GetUserID(c)

	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Invalid ad ID")
	}

	var req models.AdUpdateRequest
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Invalid request payload")
	}

	if err := c.Validate(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}

	if err := h.service.UpdateAd(uint(id), userID, &req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}

	return c.JSON(http.StatusOK, map[string]string{
		"message": "Ad updated successfully",
	})
}

func (h *ItemHandler) DeleteAd(c echo.Context) error {
	userID := middleware.GetUserID(c)

	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Invalid ad ID")
	}

	if err := h.service.DeleteAd(uint(id), userID); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}

	return c.JSON(http.StatusOK, map[string]string{
		"message": "Ad deleted successfully",
	})
}
