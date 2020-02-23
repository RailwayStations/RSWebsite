FROM composer:latest AS coposer-installer

WORKDIR /var/www/rs-website

COPY composer.json .
COPY composer.lock .
RUN composer install

FROM node:latest AS npm-installer

WORKDIR /var/www/rs-website

COPY package*.json ./
RUN npm ci --unsafe-perm

COPY ./js ./js
COPY ./css ./css
COPY ./i18n ./i18n
COPY ./scripts ./scripts
COPY ./webpack.config.js ./webpack.config.js
COPY ./postcss.config.js ./postcss.config.js
COPY ./.babelrc ./.babelrc
COPY ./map-template.ini ./

RUN npm run build

FROM php:7.2-apache

EXPOSE 80

ENV APACHE_DOCUMENT_ROOT=/var/www/rs-website/map
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

WORKDIR /var/www/rs-website

COPY ./i18n ./i18n
COPY ./map ./map
COPY ./php ./php
COPY --from=coposer-installer /var/www/rs-website/vendor ./vendor
COPY --from=npm-installer /var/www/rs-website/json ./json
COPY --from=npm-installer /var/www/rs-website/map/css ./map/css
COPY --from=npm-installer /var/www/rs-website/map/fonts ./map/fonts
COPY --from=npm-installer /var/www/rs-website/map/js ./map/js

RUN chown -R www-data:www-data /var/www/rs-website
