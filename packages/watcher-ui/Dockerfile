FROM node:lts-alpine as development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

ENV DISABLE_ESLINT=true

FROM node:lts-alpine as production

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

ENV DISABLE_ESLINT=true
ENV VITE_BASE_API_URL=http://172.2.3.191:5000

RUN npm run build

EXPOSE 80