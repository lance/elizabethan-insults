'use strict';
const path = require('path');

const express = require('express');
const probe = require('kube-probe');
const port = process.env.PORT || 8080;

const app = express();
const router = express.Router();

// add the API
router.get('/insult', require('./lib/insult'));
app.use('/api', router);

// add health and readiness endpoints
probe(app, {
  readinessURL: '/health/readiness',
  livenessURL: '/health/liveness'
});

// serve index.html from the file system
app.use('/', express.static(path.join(__dirname, 'public')));

app.listen(port);
console.log(`insult service listening on ${port}`);
