FROM node:10.9.0-alpine

RUN npm install -g nodemon

USER node
WORKDIR /home/node

COPY package.json .
RUN npm install --quiet

COPY . .

CMD ["nodemon", "server.js"]
