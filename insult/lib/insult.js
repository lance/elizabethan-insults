'use strict';

const roi = require('roi');
const opossum = require('opossum');

// circuit breaker
const circuitOptions = {
  errorThresholdPercentage: 40,
  timeout: 1000,
  resetTimeout: 10000
};

const adjectiveCircuit = opossum(
  _ => roi.get({endpoint: `http://adjective:8080/api/adjective`}),
  circuitOptions);
adjectiveCircuit.fallback(_ => '{"body": { "adjective": "lilly-livered" }}');
adjectiveCircuit.on('failure', console.error);

const nounCircuit = opossum(
    _ => roi.get({endpoint: `http://noun:8080/api/noun`}),
    circuitOptions);
nounCircuit.fallback(_ => '{"body": { "noun": "dung scraper" }}');
nounCircuit.on('failure', console.error);

module.exports = exports = function insult (req, res) {
  // call adjective and noun services
  Promise.all([
    adjectiveCircuit.fire()
    .then(response => JSON.parse(response.body).adjective.trim()),

    adjectiveCircuit.fire()
    .then(response => JSON.parse(response.body).adjective.trim()),

    nounCircuit.fire()
    .then(response => JSON.parse(response.body).noun.trim())
  ])
  .then(words => {
    const response = {
      insult: `Thou ${words[0]}, ${words[1]} ${words[2]}`
    }
    // res.set('Access-Control-Allow-Origin', '*');
    res.type('application/json').send(response);
  })
  .catch(error => {
    console.error(`Something went wrong: ${error}`);
    res.send(error);
  });
};
