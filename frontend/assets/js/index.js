'use strict';

process.env.WEB = true;

const axios = require('axios');
const opossum = require('opossum');
const $ = require('jquery');

const serviceUrl = 'http://insult-elizabethan-insults.192.168.42.207.nip.io/api/insult';

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

insult.on('success', console.log);
insult.on('fallback', console.log);
insult.on('failure', console.log);
insult.on('reject', console.log);
insult.on('open', console.log);

function getOrPostInsult (e) {
  e.preventDefault();
  const name = $('#name').val();
  if (name === '') {
    return axios.get(serviceUrl).then(result => result.data);
  }
  else {
    return axios.post(serviceUrl, { name })
      .then(result => result.data);
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

// UI event handlers
$('#invoke').click(e => insult.fire(e).then(updateInsultList));
$('#form-submit').submit(e => insult.fire(e).then(updateInsultList));
$('#clear').click(clearInsultList);
