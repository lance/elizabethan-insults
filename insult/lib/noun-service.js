const roi = require('roi');
const opossum = require('opossum');

const nounService = process.env.NOUN_SERVICE || 'noun';
const nounPort = process.env.NOUN_SERVICE_PORT || '8080';
const serviceUrl = `http://${nounService}:${nounPort}/api/noun`;

const circuitOptions = {
  errorThresholdPercentage: 70,
  timeout: 500,
  resetTimeout: 5000
};
const circuit = opossum(_ => roi.get(serviceUrl), circuitOptions);

circuit.on('failure', console.error);
circuit.fallback(_ => {
  return {
    body: JSON.stringify({ noun: 'dung scraper' })
  };
});

function parseResponse (response) {
  try {
    return JSON.parse(response.body).noun;
  } catch (err) {
    console.error('Unable to parse noun service response', response);
    console.error(err);
    return err.toString();
  }
}

module.exports = exports = {
  get: async function get () {
    return circuit.fire().then(parseResponse);
  }
};
