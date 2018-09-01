FROM node:10.9.0-alpine

RUN npm install -g nodemon

WORKDIR /opt/app

COPY package.json .
RUN npm install --quiet

COPY . .

CMD ["npm", "start"]
