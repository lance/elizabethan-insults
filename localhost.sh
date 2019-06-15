#!/bin/sh

cd adjective
# npm install
echo "starting adjective service"
PORT=8081 node . &
echo "adjective service PID $!"

cd ../noun
# npm install
echo "starting noun service"
PORT=8082 node . &
echo "noun service PID $!"

cd ../insult
# npm install
echo "starting insult service"
ADJECTIVE_SERVICE=localhost ADJECTIVE_SERVICE_PORT=8081 NOUN_SERVICE=localhost NOUN_SERVICE_PORT=8082 node . &
echo "insult service PID $!"

# To run the front end locally and have it access a local insult service, you'll
# need to change the serviceUrl variable in assets/js/index.js to 'http://localhost:8080'
cd ../frontend
echo "starting frontend"
# npm run build
# npm install
PORT=3000 node .
echo "frontend service $!"
