const roi = require('roi');
const opossum = require('opossum');

const adjectiveService = process.env.ADJECTIVE_SERVICE || 'adjective';
const adjectivePort = process.env.ADJECTIVE_SERVICE_PORT || '8080';
const serviceUrl = `http://${adjectiveService}:${adjectivePort}/api/adjective`;

const circuitOptions = {
  errorThresholdPercentage: 70,
  timeout: 500,
  resetTimeout: 5000,
  name: 'adjective service'
};
const circuit = opossum(_ => roi.get(serviceUrl), circuitOptions);
const fallbacks = [
  'beetle-headed',
  'wart-necked',
  'toad-spotted',
  'spleeny'
];
let count = 0;

circuit.on('failure', console.error);
circuit.fallback(_ => {
  return {
    body: JSON.stringify({ adjective: fallbacks[count++ % 4] })
  };
});

function parseResponse (response) {
  try {
    return JSON.parse(response.body).adjective;
  } catch (err) {
    console.error('Unable to parse adjective service response', response);
    console.error(err);
    return err.toString();
  }
}

module.exports = exports = {
  get: async function get () {
    return circuit.fire().then(parseResponse);
  }
};
