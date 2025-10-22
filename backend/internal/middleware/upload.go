package middleware

import (
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/labstack/echo/v4"
)

const (
	maxUploadSize = 10 << 20 // 10MB
)

var allowedMimeTypes = map[string]bool{
	"image/jpeg": true,
	"image/png":  true,
	"image/gif":  true,
	"image/webp": true,
	"image/bmp":  true,
}

func UploadFiles(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		// Get upload directory from environment or use default
		uploadDir := os.Getenv("UPLOAD_DIR")
		if uploadDir == "" {
			uploadDir = "./uploads/images"
		}

		// Create upload directory if it doesn't exist
		if err := os.MkdirAll(uploadDir, os.ModePerm); err != nil {
			return echo.NewHTTPError(http.StatusInternalServerError, "Failed to create upload directory")
		}

		// Parse multipart form
		if err := c.Request().ParseMultipartForm(maxUploadSize); err != nil {
			return echo.NewHTTPError(http.StatusBadRequest, "File too large")
		}

		files := c.Request().MultipartForm.File["images"]
		var filePaths []string

		for _, fileHeader := range files {
			// Open file
			file, err := fileHeader.Open()
			if err != nil {
				return echo.NewHTTPError(http.StatusInternalServerError, "Failed to open file")
			}
			defer file.Close()

			// Check MIME type
			buffer := make([]byte, 512)
			if _, err = file.Read(buffer); err != nil {
				return echo.NewHTTPError(http.StatusInternalServerError, "Failed to read file")
			}
			if _, err = file.Seek(0, 0); err != nil {
				return echo.NewHTTPError(http.StatusInternalServerError, "Failed to seek file")
			}

			mimeType := http.DetectContentType(buffer)
			if !allowedMimeTypes[mimeType] {
				return echo.NewHTTPError(http.StatusBadRequest, "Invalid file type: "+mimeType)
			}

			// Generate unique filename
			ext := strings.ToLower(filepath.Ext(fileHeader.Filename))
			if ext == "" {
				ext = "." + strings.Split(mimeType, "/")[1]
			}
			filename := generateUniqueFilename(ext)

			// Create destination file
			dstPath := filepath.Join(uploadDir, filename)
			dst, err := os.Create(dstPath)
			if err != nil {
				return echo.NewHTTPError(http.StatusInternalServerError, "Failed to create file")
			}
			defer dst.Close()

			// Copy file content
			if _, err = io.Copy(dst, file); err != nil {
				return echo.NewHTTPError(http.StatusInternalServerError, "Failed to save file")
			}

			filePaths = append(filePaths, filename)
		}

		c.Set("uploadedFiles", filePaths)
		return next(c)
	}
}

func generateUniqueFilename(ext string) string {
	return fmt.Sprintf("%d%s", time.Now().UnixNano(), ext)
}
