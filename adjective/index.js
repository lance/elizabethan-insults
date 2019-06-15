'use strict';
const path = require('path');

const express = require('express');
const port = process.env.PORT || 8080;

const app = express();
const swaggerUi = require('swagger-ui-express');

// add the API
const api = require('./lib/adjective');
app.use('/api', api(express.Router()));

// add health check endpoint
require('kube-probe')(app);

// add swagger API docs
app.use('/api-docs', swaggerUi.serve,
  swaggerUi.setup(require('./lib/adjective.json')));

app.listen(port);
console.log(`adjective service listening on ${port}`);
