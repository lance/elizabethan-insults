#!/bin/sh

cd adjective
npm install
npm run deploy

cd ../noun
npm install
npm run deploy

cd ../insult
npm install
npm run deploy
