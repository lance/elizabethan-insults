# RHOAR Shootout - Node.js

This repository contains the code for a simple application which creates Elizabethan insults. There are three services.

* The `adjective` service which exposes `GET /api/adjective`, returning a JSON object containing an antiquated adjective
* The `noun` serivce which exposes `GET /api/noun`, returning a JSON object containing a colorfully descriptive noun
* The `insult` service which exposes `GET /api/insult`, returning a JSON object containing an Elizabethan style insult composed of the aforementioned adjectives and nouns

The `insult` service also provides a simple HTTP front end at `GET /`.

## Running the Application

Each service uses the `nodeshift` CLI to deploy to OpenShift. First, you will need to be logged in. So that we can run this locally, we will use Minishift.

```sh
minishift start --vm-driver=virtualbox --memory=4096 --cpus=2
```

If you already have minishift running, make sure you are logged in with `oc login -u developer`. Then change into each of the service directories and run `npm run deploy`. If everything works as expected, you will see these services in your minishift console.