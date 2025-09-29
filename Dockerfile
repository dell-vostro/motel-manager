# ---- Build stage ----
FROM node:20-alpine AS build
WORKDIR /app

# copy manifest trước để tận dụng cache
COPY package*.json ./

# tắt audit/fund + fallback sang npm install khi ci lỗi
RUN npm config set fund false \
 && npm config set audit false \
 && if [ -f package-lock.json ]; then npm ci || npm install; else npm install; fi

# copy code còn lại và build
COPY . .
RUN npm run build

# ---- Runtime stage ----
FROM nginx:alpine
RUN rm -f /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx","-g","daemon off;"]
