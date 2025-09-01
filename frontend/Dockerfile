# Stage 1: Build React
FROM node:18 AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# Tùy biến REACT_APP_API_URL cho build production (xem phần .env bên dưới)
RUN npm run build

# Stage 2: Nginx serve static
FROM nginx:alpine
# copy build vào thư mục web root
COPY --from=build /app/build /usr/share/nginx/html
# cấu hình Nginx SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx","-g","daemon off;"]
