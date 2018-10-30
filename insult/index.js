'use strict';
const path = require('path');

const express = require('express');
const swaggerUi = require('swagger-ui-express');
const stats = require('./lib/stats');
const api = require('./lib/insult');
const probe = require('kube-probe');
const port = process.env.PORT || 8080;
const client = require('prom-client');

const app = express();

app.use('/stats.stream', stats);

app.use('/metrics', (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(client.register.metrics());
});

// add swagger API docs
app.use('/api-docs', swaggerUi.serve,
  swaggerUi.setup(require('./lib/insult.json')));

// add the API
app.use('/api', api(express.Router()));

// add health and readiness endpoints
const health = (req, res) => res.json({ status: 'OK' });
probe(app, {
  livenessURL: '/api/health',
  livenessCallback: health
});

// serve some assets from the file system
app.use('/', express.static(
  path.join(__dirname, 'public')));

app.use('/patternfly', express.static(
  path.join(__dirname, 'node_modules', 'patternfly', 'dist')));

app.use('/css/bootstrap.css', express.static(
  path.join(__dirname,
    'node_modules', 'bootstrap', 'dist', 'css', 'bootstrap.min.css')));

app.use('/js/bootstrap.js', express.static(
  path.join(__dirname,
    'node_modules', 'bootstrap', 'dist', 'js', 'bootstrap.bundle.min.js')));

app.use('/js/jquery.js', express.static(
  path.join(__dirname,
    'node_modules', 'jquery', 'dist', 'jquery.min.js')));

app.use('/js/app.js', express.static(
  path.join(__dirname, 'public', 'app.js')));

app.listen(port);

console.log(`insult service listening on ${port}`);
