'use strict';

const fs = require('fs');

module.exports = exports = function noun (req, res) {
  fs.readFile('./nouns.txt', 'utf-8', (err, data) => {
    if (err) {
      console.log(err);
      res.status(500);
      res.end(err);
      return;
    }
    const lines = data.split('\n');
    const word = lines[Math.floor(Math.random() * lines.length)];

    res.json({
      noun: word
    });
  });
};

