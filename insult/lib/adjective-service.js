const axios = require('axios');
const opossum = require('opossum');

const adjectiveService = process.env.ADJECTIVE_SERVICE || 'adjective';
const adjectivePort = process.env.ADJECTIVE_SERVICE_PORT || '8080';
const serviceUrl = `http://${adjectiveService}:${adjectivePort}/api/adjective`;

function getAdjective() {
  return axios.get(serviceUrl)
    .then(response => response.data);
}

const circuitOptions = {
  errorThresholdPercentage: 70,
  timeout: 500,
  resetTimeout: 5000,
  name: 'adjective service',
  usePrometheus: true
};
const circuit = opossum(getAdjective, circuitOptions);
const fallbacks = [
  'beetle-headed',
  'wart-necked',
  'toad-spotted',
  'spleeny'
];
let count = 0;

circuit.on('failure', console.error);
circuit.fallback(_ => ({ adjective: fallbacks[count++ % 4] }));

module.exports = exports = {
  get: async function get () {
    return circuit.fire()
      .then(response => response.adjective);
  }
};
