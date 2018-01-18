'use strict';

/**
 * A simple database of words from a text file. Each word
 * in the file is separated by a newline.
 */

module.exports = exports = function textDb (file) {
  const fs = require('fs');
  const data = fs.readFileSync(file, 'utf-8').split('\n');

  function get () {
    return data[Math.floor(Math.random() * data.length)];
  }

  function insert (word) {
    data.push(word);
    return word;
  }

  function update (word, updated) {
    const idx = data.findIndex(value => value === word);
    if (idx >= 0) data[idx] = updated;
    return data[idx];
  }

  function delete_ (word) {
    const idx = data.findIndex(value => value === word);
    if (idx >= 0) data.splice(idx, 1);
    return idx;
  }

  return {
    get,
    insert,
    update,
    delete_
  };
};
