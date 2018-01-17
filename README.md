# RHOAR Shootout - Node.js

This repository contains the code for a simple application which creates Elizabethan insults. There are three services.

* The `adjective` service which exposes `GET /api/adjective`, returning a JSON object containing an antiquated adjective
* The `noun` serivce which exposes `GET /api/noun`, returning a JSON object containing a colorfully descriptive noun
* The `insult` service which exposes `GET /api/insult`, returning a JSON object containing an Elizabethan style insult composed of the aforementioned adjectives and nouns

The `insult` service also provides a simple HTTP front end at `GET /`.

## Running the Application

## Localhost

Execute the `localhost.sh` script. It will install all of the dependencies and start each service
on a separate port on the local system.

```sh
$ ./localhost.sh
```

## OpenShift

This application should work on any current OpenShift instance. It has been developed and tested
using `minishift`. Whatever the OpenShift instance is, you need to be logged in to deploy.

```sh
$ minishift start --vm-driver=virtualbox --memory=4096 --cpus=2
$ oc login -u developer
```

Then you can run the `deploy.sh` script.

```sh
$ ./deploy.sh
```

Each service uses the `nodeshift` CLI to deploy to OpenShift.
