'use strict';

const circuitBreaker = require('opossum');
const request = require('superagent');
const $ = require('jquery');
const route = '/api/insult';

const circuitBreakerOptions = {
  timeout: 1000,
  errorThresholdPercentaage: 50,
  resetTimeout: 10000
};

const insult = circuitBreaker(getOrPostInsult, circuitBreakerOptions);
insult.fallback(_ => {
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
  $('#insults').prepend($('<li>')
    .text(`${insult.name ? insult.name + ', t' : 'T'}hou ${insult.adj1}, ${insult.adj2} ${insult.noun}!`));
}

function clearInsultList (e) {
  e.preventDefault();
  $('#insults').html('');
  $('#name').val('');
}
