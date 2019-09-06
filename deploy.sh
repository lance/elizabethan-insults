#!/bin/sh

# ./docker.sh

# kubectl create deployment adjective --image=lanceball/insults-adjective:v0.0.1
# kubectl expose deployment adjective --port=8080 --target-port=8080 --type=NodePort

# kubectl create deployment noun --image=lanceball/insults-noun:v0.0.1
# kubectl expose deployment noun --port=8080 --target-port=8080 --type=NodePort

# kubectl create deployment insult --image=lanceball/insults-insult:v0.0.1
# kubectl expose deployment insult --port=8080 --target-port=8080 --type=NodePort

# kubectl create deployment frontend --image=lanceball/insults-frontend:v0.0.1
# kubectl expose deployment frontend --port=8080 --target-port=8080 --type=NodePort

export HOST=`oc whoami --show-console | sed 's/https\(.*\):443/http\1/'`
export PORT=`oc get svc/frontend -o jsonpath='{.spec.ports[0].nodePort}'`

echo "Visit the front end at ${HOST}:${PORT}"