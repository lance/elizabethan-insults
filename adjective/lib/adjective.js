'use strict';

const bodyParser = require('body-parser');
const db = require('./db')('./adjectives.txt');
const apiPath = '/adjective';

function get (req, res) {
  res.json({ adjective: db.get() });
}

function post (req, res) {
  db.insert(req.body.adjective);
  res.sendStatus(202);
}

function delete_ (req, res) {
  if (db.delete_(req.params.word) >= 0) {
    res.sendStatus(204);
  } else {
    res.sendStatus(404);
  }
}

module.exports = exports = function adjectiveApi (router) {
  router.use(bodyParser.json());
  router.get(apiPath, get);
  router.post(apiPath, post);
  router.delete(`${apiPath}/:word`, delete_);
  return router;
};
