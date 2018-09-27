FROM node:10.9.0-alpine

RUN mkdir -p /usr/src/app
RUN chown node:node /usr/src/app

ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

EXPOSE 3000 9229

WORKDIR /usr/src/app
USER node

HEALTHCHECK --interval=15s --timeout=10s --retries=5 --start-period=30s CMD node ./healthcheck.js

COPY package*.json ./
RUN npm install --quiet --no-progress && npm cache clean --force
ENV PATH /opt/node_modules/.bin:$PATH

COPY . .

CMD ["node", "server.js"]
