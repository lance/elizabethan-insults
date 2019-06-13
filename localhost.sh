#!/bin/sh

cd adjective
# npm install
PORT=8081 node . &

cd ../noun
# npm install
PORT=8082 node . &

cd ../insult
# npm install
ADJECTIVE_SERVICE=localhost ADJECTIVE_SERVICE_PORT=8081 NOUN_SERVICE=localhost NOUN_SERVICE_PORT=8082 node . &

# To run the front end locally and have it access a local insult service, you'll
# need to change the serviceUrl variable in assets/js/index.js to 'http://localhost:8080'
cd ../frontend
# npm run build
# npm install
PORT=3000 node .