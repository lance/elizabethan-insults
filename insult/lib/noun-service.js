const request = require('request');
const opossum = require('opossum');

const nounService = process.env.NOUN_SERVICE || 'noun';
const nounPort = process.env.NOUN_SERVICE_PORT || '8080';
const serviceUrl = `http://${nounService}:${nounPort}/api/noun`;

function getNoun() {
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
  name: 'noun service',
  usePrometheus: true
};
const circuit = opossum(getNoun, circuitOptions);

circuit.on('failure', console.error);
circuit.fallback(_ => {
  return JSON.stringify({ noun: 'dung scraper' });
});

function parseResponse (response) {
  try {
    return JSON.parse(response).noun;
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

module.exports.stats = circuit.metrics.metrics;