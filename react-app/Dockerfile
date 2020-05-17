  
# stage1 as builder
FROM node:10-alpine as builder

# copy the package.json to install dependencies
COPY ./package.json ./

# Install the dependencies and make the folder
RUN npm install && mkdir /react-app && mv ./node_modules ./react-app

WORKDIR /react-app

COPY . .

# Build the project
RUN npm run build

# Stage 2 starts from nginx:alpine image
# Overrides the nginx config file
# Copies the content from the stage 1 build 
FROM nginx:alpine

#!/bin/sh

COPY ./.nginx/nginx.conf /etc/nginx/nginx.conf

## Remove default nginx index page
RUN rm -rf /usr/share/nginx/html/*

# Copy from the stage 1
COPY --from=builder /react-app/build /usr/share/nginx/html

EXPOSE 3000 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]