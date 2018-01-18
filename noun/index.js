'use strict';
const path = require('path');

const express = require('express');
const probe = require('kube-probe');
const port = process.env.PORT || 8080;

const app = express();
const swaggerUi = require('swagger-ui-express');

// add the API
const api = require('./lib/noun');
app.use('/api', api(express.Router()));

// add health check endpoint
const health = (req, res) => res.json({ status: 'OK' });
probe(app, {
  livenessURL: '/api/health',
  livenessCallback: health
});

// add swagger API docs
app.use('/api-docs', swaggerUi.serve,
  swaggerUi.setup(require('./lib/noun.json')));

// serve licenses/licenses.html from the file system
app.use('/licenses', express.static(path.join(__dirname, 'licenses')));

app.listen(port);
console.log(`noun service listening on ${port}`);
