'use strict';

const cors = require('cors');
const bodyParser = require('body-parser');
const nounService = require('./noun-service');
const adjectiveService = require('./adjective-service');
const circuitBreaker = require('opossum');

function get (req, res) {
  res.type('application/json');
  buildInsult()
    .then(insult => res.send(insult))
    .catch(error => {
      console.error(error.toString());
      console.error(error.stack);
      res.send({ error: error.toString() });
    });
}

function post (req, res) {
  res.type('application/json');
  buildInsult()
    .then(insult => Object.assign({ name: req.body.name }, insult))
    .then(insult => { res.status(201); res.send(insult); })
    .catch(error => {
      console.error(error.toString());
      console.error(error.stack);
      res.send({ error: error.toString() });
    });
}

function metrics(req, res) {
  res.type('text/plain');
  res.send(circuitBreaker.metrics());
}

function buildInsult () {
  // call adjective and noun services
  return Promise.all([
    adjectiveService.get(),
    adjectiveService.get(),
    nounService.get()
  ])
    .then(words => ({
      adj1: words[0],
      adj2: words[1],
      noun: words[2]
    }))
    .catch(e => console.error(`An unexpected error occurred: ${e}`));
}

module.exports = exports = function insultApi (router) {
  router.use(bodyParser.json());
  router.options('*', cors());
  router.get('/insult', cors(), get);
  router.post('/insult', cors(), post);
  router.get('/metrics', metrics);
  return router;
};
