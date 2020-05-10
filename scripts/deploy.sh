set -e
echo "Push image to docker hub using docker push"

echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin
docker tag mockserver:latest samuraitruong/mockserver:latest
docker tag mockserver:lts samuraitruong/mockserver:lts
docker push samuraitruong/mockserver:latest
docker push samuraitruong/mockserver:lts

if [ "$TRAVIS_TAG" ]; then
  docker tag mockserver:latest samuraitruong/mockserver:$IMAGE_TAG
  docker push samuraitruong/mockserver:$IMAGE_TAG
  docker tag mockserver:latest samuraitruong/mockserver:$TRAVIS_TAG
  docker push samuraitruong/mockserver:$TRAVIS_TAG
fi
