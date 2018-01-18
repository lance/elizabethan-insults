'use strict';

const roi = require('roi');
const opossum = require('opossum');
const bodyParser = require('body-parser');

function get (req, res) {
  res.type('application/json');
  buildInsult()
    .then(insult => res.send(insult))
    .catch(error => {
      console.error(error.toString());
      console.error(error.stack);
      res.send({ error: error.toString() });
    });
}

function post (req, res) {
  res.type('application/json');
  buildInsult()
    .then(insult => Object.assign({ name: req.body.name }, insult))
    .then(insult => res.send(insult))
    .catch(error => {
      console.error(error.toString());
      console.error(error.stack);
      res.send({ error: error.toString() });
    });
}

const circuitOptions = {
  errorThresholdPercentage: 70,
  timeout: 1000,
  resetTimeout: 10000
};

function buildCircuit (url, fallback) {
  const circuit = opossum(_ => roi.get(url), circuitOptions);
  circuit.on('failure', console.error);
  return circuit;
}

const adjectiveService = process.env.ADJECTIVE_SERVICE || 'adjective';
const adjectivePort = process.env.ADJECTIVE_SERVICE_PORT || '8080';
const adjectiveCircuit =
  buildCircuit(`http://${adjectiveService}:${adjectivePort}/api/adjective`);

const nounService = process.env.NOUN_SERVICE || 'noun';
const nounPort = process.env.NOUN_SERVICE_PORT || '8080';
const nounCircuit =
  buildCircuit(`http://${nounService}:${nounPort}/api/noun`);

function buildInsult () {
  // call adjective and noun services
  return Promise.all([
    adjectiveCircuit.fire().then(handleResponse('adjective'), 'artless'),
    adjectiveCircuit.fire().then(handleResponse('adjective'), 'lilly-livered'),
    nounCircuit.fire().then(handleResponse('noun'), 'dung scraper')
  ])
  .then(words => ({
    adj1: words[0],
    adj2: words[1],
    noun: words[2]
  }))
  .catch(console.error);
}

function handleResponse (type) {
  return function parseResponse (response, fallback) {
    try {
      return JSON.parse(response.body)[type];
    } catch (err) {
      console.error('Unable to parse response', response);
      console.error(err);
      return fallback;
    }
  };
}

module.exports = exports = function insultApi (router) {
  router.use(bodyParser.json());
  router.get('/insult', get);
  router.post('/insult', post);
  return router;
};
