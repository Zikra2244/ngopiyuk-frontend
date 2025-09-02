# Build stage
FROM node:20-alpine AS build
WORKDIR /usr/src/app

ARG VITE_API_URL
ARG VITE_PHOTO_URL
ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_PHOTO_URL=${VITE_PHOTO_URL}

COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Serve stage
FROM nginx:stable-alpine

# Salin hasil build React ke direktori Nginx
COPY --from=build /usr/src/app/dist /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf

# Salin file konfigurasi kita ke folder yang benar
COPY nginx.conf /etc/nginx/conf.d/
# ======================================================================

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]