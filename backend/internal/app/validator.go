package app

import (
	"regexp"

	"github.com/go-playground/validator/v10"
)

type CustomValidator struct {
	validator *validator.Validate
}

func (cv *CustomValidator) Validate(i interface{}) error {
	return cv.validator.Struct(i)
}

// ValidatePhone проверяет номер телефона
func ValidatePhone(fl validator.FieldLevel) bool {
	phone := fl.Field().String()
	// Regex для валидации российских номеров телефона
	phoneRegex := regexp.MustCompile(`^(\+7|8)?[\s\-]?\(?[0-9]{3}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$`)
	return phoneRegex.MatchString(phone)
}

func (a *App) SetupValidator() {
	v := validator.New()

	// Регистрируем кастомную валидацию для телефона
	v.RegisterValidation("phone", ValidatePhone)

	a.echo.Validator = &CustomValidator{validator: v}
}
