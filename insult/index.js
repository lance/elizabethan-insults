'use strict';

const express = require('express');
const swaggerUi = require('swagger-ui-express');
const api = require('./lib/insult');

const app = express();
const port = process.env.PORT || 8080;

// add swagger API docs
app.use('/api-docs', swaggerUi.serve,
  swaggerUi.setup(require('./lib/insult.json')));

// add the API
app.use('/api', api(express.Router()));

// add liveness and readiness endpoints
// at /api/health/liveness and /api/health/readiness
require('kube-probe')(app);

app.listen(port);

console.log(`insult service listening on ${port}`);
