set -e
echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin
docker tag mockserver:latest samuraitruong/mockserver:latest
docker tag mockserver:latest samuraitruong/mockserver:$IMAGE_TAG
docker push samuraitruong/mockserver:latest
docker push samuraitruong/mockserver:$IMAGE_TAG
