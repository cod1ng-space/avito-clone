package interfaces

import "github.com/labstack/echo/v4"

type AuthHandler interface {
	Register(c echo.Context) error
	Login(c echo.Context) error
}

type UserHandler interface {
	GetProfile(c echo.Context) error
	UpdateProfile(c echo.Context) error
}

type CategoryHandler interface {
	GetCategories(c echo.Context) error
}

type AdHandler interface {
	CreateAd(c echo.Context) error
	CreateAdWithImages(c echo.Context) error
	GetAd(c echo.Context) error
	GetUserAds(c echo.Context) error
	SearchAds(c echo.Context) error
	UpdateAd(c echo.Context) error
	DeleteAd(c echo.Context) error
}

type ImageHandler interface {
	AddImages(c echo.Context) error
	DeleteImage(c echo.Context) error
}
