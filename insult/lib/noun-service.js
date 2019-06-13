const axios = require('axios');
const opossum = require('opossum');

const nounService = process.env.NOUN_SERVICE || 'noun';
const nounPort = process.env.NOUN_SERVICE_PORT || '8080';
const serviceUrl = `http://${nounService}:${nounPort}/api/noun`;

function getNoun() {
  return axios.get(serviceUrl)
    .then(response => response.data);
}

const circuitOptions = {
  errorThresholdPercentage: 70,
  timeout: 500,
  resetTimeout: 5000,
  name: 'noun service',
  usePrometheus: true
};
const circuit = opossum(getNoun, circuitOptions);

circuit.on('failure', console.error);
circuit.fallback({ noun: 'dung scraper' });

module.exports = exports = {
  get: async function get () {
    return circuit.fire()
      .then(response => response.noun);
  }
};

module.exports.stats = circuit.metrics.metrics;