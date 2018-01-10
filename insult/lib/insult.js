'use strict';

const roi = require('roi');
const opossum = require('opossum');

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

const adjectiveService = 'adjective';
const adjectivePort = '8080';
const adjectiveCircuit =
  buildCircuit(`http://${adjectiveService}:${adjectivePort}/api/adjective`);

const nounService = 'adjective';
const nounPort = '8080';
const nounCircuit =
  buildCircuit(`http://${nounService}:${nounPort}/api/noun`);

function parseResponse (response, fallback) {
  try {
    return JSON.parse(response.body).word;
  } catch (err) {
    console.error(`Unable to parse response: ${response}`);
    console.error(err);
    return fallback;
  }
}

module.exports = exports = function insult (req, res) {
  res.type('application/json');
  // call adjective and noun services
  Promise.all([
    adjectiveCircuit.fire().then(parseResponse, 'artless'),
    adjectiveCircuit.fire().then(parseResponse, 'lilly-livered'),
    nounCircuit.fire().then(parseResponse, 'dung scraper')
  ])
  .then(words =>
    res.send({
      insult: `Thou ${words[0]}, ${words[1]} ${words[2]}!`
    })
  )
  .catch(error => {
    console.error(error.toString());
    console.error(error.stack);
    res.send({ insult: error.toString() });
  });
};
