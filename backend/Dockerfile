# Build stage
FROM golang:1.23-alpine AS builder

WORKDIR /app

# Copy go mod files
COPY go.mod ./
RUN go mod download

# Copy source code
COPY . .

# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main ./cmd/server

# Production stage
FROM alpine:latest

RUN apk --no-cache add ca-certificates tzdata
WORKDIR /app

# Copy the binary from builder stage
COPY --from=builder /app/main .

# Copy any existing uploads directory
COPY --from=builder /app/uploads ./uploads

# Create uploads directory if it doesn't exist
RUN mkdir -p uploads/images

# Expose port
EXPOSE 8080

# Run the binary
CMD ["./main"]