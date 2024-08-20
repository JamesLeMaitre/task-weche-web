FROM node:lts-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install -g npm@latest
RUN npm ci
COPY . .
RUN npm install
RUN npm run  build --prod

FROM nginx:latest
RUN mkdir /app
COPY --from=build-stage /app/dist/weche-web/ /app

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 6080

CMD ["nginx", "-g", "daemon off;"]

USER root

