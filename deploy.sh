echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin
docker tag mockserver:latest samuraitruong/mockserver:latest
docker push samuraitruong/mockserver:latest
