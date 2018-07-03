const circuitBreaker = require('opossum');

module.exports = function statStream (request, response) {
  response.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'});
  response.write('retry: 10000\n');
  response.write('event: connecttime\n');
  circuitBreaker.stats.pipe(response);
};
