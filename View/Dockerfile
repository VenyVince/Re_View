# Dockerfile.fe
FROM node:22-alpine AS build

WORKDIR /app
COPY . .
RUN npm install

ARG REACT_APP_API_BASE_URL
ENV REACT_APP_API_BASE_URL=$REACT_APP_API_BASE_URL

RUN npm run build

# Serve to Nginx
FROM nginx:stable-alpine

COPY --from=build /app/build /usr/share/nginx/html
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]