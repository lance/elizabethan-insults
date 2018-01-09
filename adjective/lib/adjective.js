'use strict';

const fs = require('fs');

module.exports = exports = function adjective (req, res) {
  console.log('request received');
  fs.readFile('./adjectives.txt', 'utf-8', (err, data) => {
    if (err) {
      console.log(err);
      res.status(500);
      res.end(err);
      return;
    }
    const lines = data.split('\n');
    const word = lines[Math.floor(Math.random() * lines.length)];

    res.json({
      word,
      type: 'adjective'
    });
  });
};

