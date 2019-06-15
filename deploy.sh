#!/bin/sh

cd adjective
npm install nodeshift
npm run deploy

cd ../noun
npm install nodeshift
npm run deploy

cd ../insult
npm install nodeshift
npm run deploy

echo "Before deploying the front end, update the insult serviceUrl in frontend/assets/js/index.js"
#cd ../frontend
#npm install nodeshift
# npm run deploy
