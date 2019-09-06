'use strict';

const axios = require('axios');
const circuitBreaker = require('opossum');
const $ = require('jquery');

// const serviceUrl = process.env.INSULT_SERVICE || 'http://localhost:8080/api/insult';
let serviceUrl;
axios.get('/insult-url').then(result => {
  console.log(result);
  serviceUrl = result.data;
});

const circuitBreakerOptions = {
  timeout: 1000,
  errorThresholdPercentaage: 50,
  resetTimeout: 8000,
  name: 'insult service'
};

const insult = new circuitBreaker(getOrPostInsult, circuitBreakerOptions);
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
  let url = $('#service-url').val();

  if (url === undefined || url === '') {
    url = serviceUrl; 
  }
  console.log(`Fetching insult from ${url}`);
  if (name === '') {
    return axios.get(url)
      .then(result => result.data);
  }
  else {
    return axios.post(url, { name })
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
