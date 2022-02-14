FROM node:16.14.0-alpine3.15

WORKDIR /app

COPY package.json ./

RUN npm install -g npm@8.3.0

RUN npm install

COPY . .

CMD [ "npm", "run", "start:prod" ]
