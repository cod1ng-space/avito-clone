# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Install serve globally
RUN npm install -g serve

# Copy built application from builder stage
COPY --from=builder /app/build ./build

# Expose port
EXPOSE 3000

# Serve the application
CMD ["serve", "-s", "build", "-l", "3000"]