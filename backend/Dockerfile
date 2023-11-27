# syntax=docker/dockerfile:1

FROM node:18-alpine
WORKDIR /backend

RUN npm install -g nodemon

COPY . .
RUN npm install
EXPOSE 3000

CMD ["npm", "start"]