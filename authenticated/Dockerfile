 # syntax=docker/dockerfile:1
  FROM node:19-alpine
  WORKDIR /app
  COPY . .
  RUN npm install
  CMD ["npm", "run", "dev"]
  EXPOSE 3000