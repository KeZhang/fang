docker stop fang && docker rm fang

docker run -d --name fang \
-v $(pwd)/docs:/usr/share/nginx/html/fang \
-p 8000:80 nginx

docker logs -f fang
