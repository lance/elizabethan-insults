'use strict';
const path = require('path');

const express = require('express');
const probe = require('kube-probe');
const insultService = process.env.INSULT_SERVICE || 'http://localhost:8080/api/insult'
const port = process.env.PORT || 8080;
const app = express();


// add liveness and readiness endpoints
require('kube-probe')(app);

app.get('/insult-url', (request, response) => response.end(insultService));

// serve assets from the file system
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

app.listen(port, _ => console.log(`front end listening on ${port}`));
