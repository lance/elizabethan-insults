'use strict';
const path = require('path');

const express = require('express');
const port = process.env.PORT || 8080;

const app = express();
const swaggerUi = require('swagger-ui-express');

// add the API
const api = require('./lib/noun');
app.use('/api', api(express.Router()));

// add health check endpoint
require('kube-probe')(app);

// add swagger API docs
app.use('/api-docs', swaggerUi.serve,
  swaggerUi.setup(require('./lib/noun.json')));

app.listen(port);
console.log(`noun service listening on ${port}`);
