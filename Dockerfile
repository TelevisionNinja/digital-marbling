FROM nginx:latest

RUN apt-get update -y

WORKDIR /usr/share/nginx/html/
COPY ./ ./

EXPOSE 80
