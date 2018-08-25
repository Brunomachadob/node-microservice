FROM node:8.1.0-alpine

RUN apk update && apk upgrade && \
    apk add --no-cache bash git

COPY . /opt/code/

WORKDIR /opt/code/

RUN npm install -g pm2

RUN npm install

CMD npm start