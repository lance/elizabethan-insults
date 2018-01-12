'use strict';
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const api = require('./lib/insult.json');
const probe = require('kube-probe');
const port = process.env.PORT || 8080;

const app = express();

// support JSON data
app.use(bodyParser.json());

// add swagger API docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(api));

// add the API
const router = express.Router();
const { get, post } = require('./lib/insult');
router.get('/insult', get);
router.post('/insult', post);
app.use('/api', router);

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
