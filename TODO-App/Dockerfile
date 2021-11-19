FROM node:17-alpine3.12 AS todo-build
WORKDIR /user/src/app
COPY package*.json /user/src/app/
RUN npm install
COPY . /user/src/app/
RUN npm run build
FROM nginx:alpine
COPY --from=todo-build /user/src/app/dist/TODO-App /usr/share/nginx/html
EXPOSE 80