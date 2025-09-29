# Stage 1: Build React/Vite app
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# Build static files to /app/dist
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine
# Replace default server config with our SPA config
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
