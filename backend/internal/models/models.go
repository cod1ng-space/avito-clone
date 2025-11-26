package models

import (
	"time"
)

type User struct {
	ID            uint      `gorm:"primaryKey" json:"id"`
	Email         string    `gorm:"uniqueIndex;not null" json:"email"`
	Username      string    `gorm:"not null" json:"username"`
	Phone         string    `gorm:"not null" json:"phone"`
	SocialNetwork *string   `json:"social_network,omitempty"`
	SocialContact *string   `json:"social_contact,omitempty"`
	PasswordHash  string    `gorm:"not null" json:"-"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
	Ads           []Ad      `json:"-"`
}

type Category struct {
	ID            uint          `gorm:"primaryKey" json:"id"`
	Name          string        `gorm:"uniqueIndex;not null" json:"name"`
	Subcategories []Subcategory `json:"subcategories,omitempty"`
}

type Subcategory struct {
	ID         uint     `gorm:"primaryKey" json:"id"`
	Name       string   `gorm:"not null" json:"name"`
	CategoryID uint     `gorm:"not null" json:"category_id"`
	Category   Category `json:"-"`
}

type Ad struct {
	ID            uint        `gorm:"primaryKey" json:"id"`
	Title         string      `gorm:"not null" json:"title"`
	Description   string      `gorm:"not null;type:text" json:"description"`
	UserID        uint        `gorm:"not null" json:"user_id"`
	User          User        `json:"user"`
	SubcategoryID uint        `gorm:"not null" json:"subcategory_id"`
	Subcategory   Subcategory `json:"subcategory"`
	CreatedAt     time.Time   `json:"created_at"`
	UpdatedAt     time.Time   `json:"updated_at"`
	Images        []AdImage   `json:"images"`
}

type AdImage struct {
	ID         uint   `gorm:"primaryKey" json:"id"`
	AdID       uint   `gorm:"not null" json:"ad_id"`
	FilePath   string `gorm:"not null" json:"file_path"`
	OrderIndex int    `gorm:"not null" json:"order_index"`
}

type AuthRequest struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required,min=6"`
}

type RegisterRequest struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required,min=6"`
	Username string `json:"username" validate:"required,min=3,max=100"`
	Phone    string `json:"phone" validate:"required,phone"`
}

type AdCreateRequest struct {
	Title         string `json:"title" validate:"omitempty,min=3,max=100"`
	Description   string `json:"description" validate:"required,min=20,max=5000"`
	SubcategoryID uint   `json:"subcategory_id" validate:"required"`
}

type AdUpdateRequest struct {
	Title         string `json:"title" validate:"omitempty,min=3,max=100"`
	Description   string `json:"description" validate:"omitempty,min=20,max=5000"`
	SubcategoryID uint   `json:"subcategory_id" validate:"omitempty"`
}

type UserUpdateRequest struct {
	Username      string  `json:"username" validate:"omitempty,min=3,max=100"`
	Phone         string  `json:"phone" validate:"omitempty,phone"`
	SocialNetwork *string `json:"social_network" validate:"omitempty"`
	SocialContact *string `json:"social_contact" validate:"omitempty"`
}

type SearchParams struct {
	Query       string `query:"q"`
	Page        int    `query:"page"`
	Limit       int    `query:"limit"`
	Category    string `query:"category"`
	Subcategory string `query:"subcategory"`
}
