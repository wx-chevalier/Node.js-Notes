FROM node:10.15.1-alpine

RUN apk --update add tzdata \
  && cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime \
  && echo "Asia/Shanghai" > /etc/timezone \
  && apk del tzdata

COPY ./scripts/docker/resolv.conf /etc/

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

# add npm package
COPY package.json /usr/src/app/package.json

RUN yarn install --registry=https://registry.npm.taobao.org

# copy code
COPY . /usr/src/app

EXPOSE 7001

RUN yarn run build

# rm source code
RUN rm -rf ./*.ts
RUN rm -rf ./db

CMD yarn start:prod
