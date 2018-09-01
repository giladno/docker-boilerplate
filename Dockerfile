FROM node:10.9.0-alpine

RUN npm install -g nodemon

RUN mkdir -p /usr/src/app
RUN chown node:node /usr/src/app
WORKDIR /usr/src/app
USER node

COPY package*.json .
RUN npm install --quiet --no-progress && npm cache clean --force

COPY . .

CMD ["nodemon", "server.js"]
