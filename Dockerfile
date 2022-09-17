FROM node:16.17.0
WORKDIR /usr/src/clean-node-api
COPY package.json .
RUN npm install --only=prod
EXPOSE 5000
