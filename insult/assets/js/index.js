'use strict';

const circuitBreaker = require('opossum');
const request = require('superagent');
const $ = require('jquery');
const route = '/api/insult';

const circuitBreakerOptions = {
  timeout: 1000,
  errorThresholdPercentaage: 50,
  resetTimeout: 8000,
  name: 'insult service'
};

const insult = circuitBreaker(getOrPostInsult, circuitBreakerOptions);
const localStats = insult.hystrixStats.getHystrixStream();
localStats.on('data', message => updateStats(JSON.parse(message.substr(6))));

new EventSource('/stats.stream').onmessage =
  message => updateStats(JSON.parse(message.data));

insult.fallback(function () {
  return {
    name: 'Server Admin',
    adj1: 'sleep-addled',
    adj2: 'half witted',
    noun: 'bumbershoot'
  };
});

insult.on('failure', console.log);
insult.on('reject', console.log);
insult.on('open', console.log);

// UI event handlers
$('#invoke').click(e => insult.fire(e).then(updateInsultList));
$('#form-submit').submit(e => insult.fire(e).then(updateInsultList));
$('#clear').click(clearInsultList);

function getOrPostInsult (e) {
  e.preventDefault();
  const name = $('#name').val();
  if (name === '') return request.get(route).then(result => JSON.parse(result.text));
  else {
    return request.post(route)
      .set('Content-Type', 'application/json')
      .send({ name })
      .then(result => JSON.parse(result.text));
  }
}

function updateInsultList (insult) {
  $('#insults').prepend($('<li class="list-group-item">')
    .text(`${insult.name ? `${insult.name}, t` : 'T'}hou ${insult.adj1}, ${insult.adj2} ${insult.noun}!`));
}

function clearInsultList (e) {
  e.preventDefault();
  $('#insults').html('');
  $('#name').val('');
}

function updateStats (stats) {
  const [ serviceName, _ ] = stats.name.split(' ');
  $(`#${serviceName}_successes`).html(stats.rollingCountSuccess || stats.successes);
  $(`#${serviceName}_failures`).html(stats.errorCount || stats.errors);
  $(`#${serviceName}_fallbacks`).html(stats.rollingCountFallbackEmit || stats.fallbacks);
  $(`#${serviceName}_fires`).html(stats.requestCount || stats.fires);
  if (stats.latencyTotal_mean) {
    $(`#${serviceName}_latency-mean`).html(stats.latencyTotal_mean.toFixed(2));
  }
}
