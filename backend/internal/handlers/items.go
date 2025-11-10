package handlers

import (
	"net/http"
	"strconv"

	"adboard/internal/interfaces"
	"adboard/internal/middleware"
	"adboard/internal/models"

	"github.com/labstack/echo/v4"
)

type ItemHandler struct {
	service interfaces.Service
}

func NewItemHandler(service interfaces.Service) interfaces.ItemHandler {
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

func (h *ItemHandler) CreateAdWithImages(c echo.Context) error {
	userID := middleware.GetUserID(c)

	// Получаем данные объявления из form-data
	title := c.FormValue("title")
	description := c.FormValue("description")
	subcategoryIDStr := c.FormValue("subcategory_id")

	if title == "" || description == "" || subcategoryIDStr == "" {
		return echo.NewHTTPError(http.StatusBadRequest, map[string]string{
			"message": "Отсутствуют обязательные поля",
			"error":   "title, description и subcategory_id обязательны",
		})
	}

	// Преобразуем subcategory_id в uint
	subcategoryID, err := strconv.ParseUint(subcategoryIDStr, 10, 32)
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, map[string]string{
			"message": "Неверный ID подкатегории",
			"error":   err.Error(),
		})
	}

	// Создаем запрос для валидации
	req := models.AdCreateRequest{
		Title:         title,
		Description:   description,
		SubcategoryID: uint(subcategoryID),
	}

	if err := c.Validate(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, map[string]string{
			"message": "Ошибка валидации данных",
			"error":   err.Error(),
		})
	}

	// Создаем объявление
	ad := &models.Ad{
		Title:         req.Title,
		Description:   req.Description,
		UserID:        userID,
		SubcategoryID: req.SubcategoryID,
	}

	// Получаем загруженные изображения (если есть)
	uploadedFiles, _ := c.Get("uploadedFiles").([]string)

	// Создаем объявление и добавляем изображения в одной транзакции
	if err := h.service.CreateAdWithImages(ad, uploadedFiles); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, map[string]string{
			"message": "Ошибка создания объявления",
			"error":   err.Error(),
		})
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
		limit = 12
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
	subcategoryStr := c.QueryParam("subcategory")
	page, _ := strconv.Atoi(c.QueryParam("page"))
	limit, _ := strconv.Atoi(c.QueryParam("limit"))

	if page < 1 {
		page = 1
	}
	if limit < 1 {
		limit = 12
	}

	var categoryID uint
	if categoryStr != "" {
		catID, err := strconv.ParseUint(categoryStr, 10, 0)
		if err != nil {
			return echo.NewHTTPError(http.StatusBadRequest, "Invalid category ID")
		}
		categoryID = uint(catID)
	}

	var subcategoryID uint
	if subcategoryStr != "" {
		subID, err := strconv.ParseUint(subcategoryStr, 10, 0)
		if err != nil {
			return echo.NewHTTPError(http.StatusBadRequest, "Invalid subcategory ID")
		}
		subcategoryID = uint(subID)
	}

	ads, total, err := h.service.SearchAds(query, categoryID, subcategoryID, page, limit)
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
