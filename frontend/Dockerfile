# Stage 1: Build React app
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# 1. Remove default Nginx config
RUN rm /etc/nginx/conf.d/default.conf

# 2. Copy our custom config
COPY nginx.conf /etc/nginx/conf.d/

# 3. Copy built assets from builder stage
COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]