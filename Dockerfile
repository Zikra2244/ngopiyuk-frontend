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

# Copy build output - PASTIKAN PATH BENAR
COPY --from=build /usr/src/app/dist /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]