'use strict';

process.env.WEB = true;

const request = require('superagent');
const opossum = require('opossum');
const $ = require('jquery');

const serviceUrl = 'http://insult-elizabethan-insults.192.168.42.207.nip.io/api/insult';

// UI event handlers
$('#invoke').click(e => insult.fire(e).then(updateInsultList));
$('#form-submit').submit(e => insult.fire(e).then(updateInsultList));
$('#clear').click(clearInsultList);

const circuitBreakerOptions = {
  timeout: 1000,
  errorThresholdPercentaage: 50,
  resetTimeout: 8000,
  name: 'insult service'
};

const insult = opossum(getOrPostInsult, circuitBreakerOptions);
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

function getOrPostInsult (e) {
  e.preventDefault();
  const name = $('#name').val();
  if (name === '') {
    return request.get(serviceUrl).then(result => JSON.parse(result.text));
  }
  else {
    return request.post(serviceUrl)
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
