# ---- Build Stage ----
FROM node:22.20.0-alpine AS builder

# Ensure npm version matches the requirement
RUN npm install -g npm@10.9.3

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy application source
COPY . .

# Accept build-time variable for the backend URL
ARG REACT_APP_BACKEND_URL
ENV REACT_APP_BACKEND_URL=$REACT_APP_BACKEND_URL

# Build the app
RUN npm run build

# ---- Production Stage ----
FROM nginx:alpine

# Copy custom nginx configuration to listen on port 3000
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from the builder stage
COPY --from=builder /app/build /usr/share/nginx/html

# Expose the port the app runs on
EXPOSE 3000

# Start nginx
CMD ["nginx", "-g", "daemon off;"]