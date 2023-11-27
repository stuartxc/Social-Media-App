# syntax=docker/dockerfile:1

FROM node:18-alpine
WORKDIR /frontend
COPY . .
RUN npm install
EXPOSE 80
CMD ["npm", "run", "dev"]