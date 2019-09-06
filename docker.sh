#!/bin/sh

#docker build -t docker.io/lanceball/elizabethan-insults:v0.0.1 .
# docker run -d --cidfile app.cid --rm -p 3000:3000 -p 8080:8080 lanceball/elizabethan-insults:v0.0.1

# docker container ls

# echo "To stop the container, run 'docker stop \$(cat app.cid)'"

cd adjective
npm run image:build
npm run image:push

cd ../noun
npm run image:build
npm run image:push

cd ../adjective
npm run image:build
npm run image:push

cd ../frontend
npm run image:build
npm run image:push
