#!/bin/bash
PROJECT="nest-realworld-app"

git pull

echo 'start build docker image.'
docker build -t ${PROJECT}:latest -f ./scripts/docker/Dockerfile .

echo 'stop and remove the current container.'
docker container stop ${PROJECT}
docker container rm ${PROJECT}

echo 'run a new container.'
docker run -d --restart always -p 7001:7001 --name ${PROJECT} --network host -v ~/logs/nest:/root/logs -v /tmp:/tmp ${PROJECT}:latest
