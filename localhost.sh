#!/bin/sh

cd adjective
npm install
PORT=8081 node . &
cd ../noun
npm install
PORT=8082 node . &
cd ../insult
npm install
ADJECTIVE_SERVICE=localhost ADJECTIVE_SERVICE_PORT=8081 NOUN_SERVICE=localhost NOUN_SERVICE_PORT=8082 node .