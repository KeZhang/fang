cp cooker/crawler/*.merged.json ./static/

npm run generate

git add .

git commit -m 'publish'
