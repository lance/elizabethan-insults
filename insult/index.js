'use strict';
const path = require('path');

const express = require('express');
const swaggerUi = require('swagger-ui-express');
const api = require('./lib/insult.js');
const probe = require('kube-probe');
const port = process.env.PORT || 8080;

const app = express();

// add swagger API docs
app.use('/api-docs', swaggerUi.serve,
  swaggerUi.setup(require('./lib/insult.json')));

// add the API
app.use('/api', api(express.Router()));

// add health and readiness endpoints
probe(app, {
  readinessURL: '/health/readiness',
  livenessURL: '/health/liveness'
});

// serve index.html from the file system
app.use('/', express.static(path.join(__dirname, 'public')));
app.use('/licenses', express.static(path.join(__dirname, 'licenses')));

app.listen(port);
console.log(`insult service listening on ${port}`);
