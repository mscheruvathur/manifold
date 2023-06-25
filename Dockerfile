FROM node:18-alpine

WORKDIR /manifold

COPY package*.json ./

COPY . .

RUN npm install -g ts-node

RUN npm install 

RUN npm run build

CMD [ "npm","run","dev" ]