const request = require('request');
const opossum = require('opossum');

const adjectiveService = process.env.ADJECTIVE_SERVICE || 'adjective';
const adjectivePort = process.env.ADJECTIVE_SERVICE_PORT || '8080';
const serviceUrl = `http://${adjectiveService}:${adjectivePort}/api/adjective`;

function getAdjective() {
  return new Promise((resolve, reject) => {
    request.get(serviceUrl, (error, response, body) => {
      if (error) return reject(error);
      if (response.statusCode > 200) return reject(response.statusMessage);
      return resolve(body);
    })
  });
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
circuit.fallback(_ => {
  return JSON.stringify({ adjective: fallbacks[count++ % 4] });
});

function parseResponse (response) {
  try {
    return JSON.parse(response).adjective;
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
