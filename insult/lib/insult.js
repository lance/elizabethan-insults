'use strict';

const roi = require('roi');
const opossum = require('opossum');

// circuit breaker
const circuitOptions = {
  errorThresholdPercentage: 40,
  timeout: 1000,
  resetTimeout: 10000
};

const adjectiveFallback = JSON.stringify({
  body: {
    word: 'lilly-livered',
    type: 'adjective'
  }
});

const nounFallback = JSON.stringify({
  word: 'dung scraper',
  type: 'noun'
});

const adjectiveCircuit = opossum(_ => {
  try {
    // ROI will actually throw an exception if the hostname does not exist
    // so we have to wrap it here.
    return roi.get({endpoint: `http://adjective:8080/api/adjective`});
  } catch (err) {
    return Promise.reject(adjectiveFallback);
  }
},
circuitOptions);
adjectiveCircuit.fallback(_ => adjectiveFallback);
adjectiveCircuit.on('failure', console.error);

const nounCircuit = opossum(_ => {
  try {
    return roi.get({endpoint: `http://noun:8080/api/noun`});
  } catch (err) {
    return Promise.reject(nounFallback);
  }
},
circuitOptions);
nounCircuit.fallback(_ => nounFallback);
nounCircuit.on('failure', console.error);

function parseResponse (response) {
  console.log(response.toString());
  try {
    return JSON.parse(response.body).word;
  } catch (err) {
    return err.toString();
  }
}

module.exports = exports = function insult (req, res) {
  // call adjective and noun services
  Promise.all([
    adjectiveCircuit.fire().then(parseResponse),
    adjectiveCircuit.fire().then(parseResponse),
    nounCircuit.fire().then(parseResponse)
  ])
  .then(words => {
    const response = {
      insult: `Thou ${words[0]}, ${words[1]} ${words[2]}`
    };
    // res.set('Access-Control-Allow-Origin', '*');
    res.type('application/json').send(response);
  })
  .catch(error => {
    console.error(`Something went wrong: ${error}`);
    res.send(error);
  });
};
