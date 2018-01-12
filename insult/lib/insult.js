'use strict';

const roi = require('roi');
const opossum = require('opossum');

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
  console.log(req.body);
  buildInsult()
    .then(insult => Object.assign({ name: 'smelly' }, insult))
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
const adjectivePort = process.env.ADJECTIVE_PORT || '8080';
const adjectiveCircuit =
  buildCircuit(`http://${adjectiveService}:${adjectivePort}/api/adjective`);

const nounService = process.env.NOUN_SERVICE || 'noun';
const nounPort = process.env.NOUN_PORT || '8080';
const nounCircuit =
  buildCircuit(`http://${nounService}:${nounPort}/api/noun`);

function buildInsult () {
  // call adjective and noun services
  return Promise.all([
    adjectiveCircuit.fire().then(parseResponse, 'artless'),
    adjectiveCircuit.fire().then(parseResponse, 'lilly-livered'),
    nounCircuit.fire().then(parseResponse, 'dung scraper')
  ]).then(words => ({
    adj1: words[0],
    adj2: words[1],
    noun: words[2]
  }));
}

function parseResponse (response, fallback) {
  try {
    return JSON.parse(response.body).word;
  } catch (err) {
    console.error('Unable to parse response', response);
    console.error(err);
    return fallback;
  }
}
module.exports = exports = { get, post };
