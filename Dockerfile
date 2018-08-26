FROM node:8.1.0-alpine

RUN apk update && apk upgrade && \
    apk add --no-cache bash git

WORKDIR /opt/code/
COPY . /opt/code/

RUN npm install -g pm2 && \
    npm install && \
    npm run build

EXPOSE 3000

CMD ["pm2-runtime", "pm2.yml"]