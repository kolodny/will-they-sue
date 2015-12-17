#!/usr/bin/env node

var Promise = require('bluebird');
var glob = require('glob');
var fs = require('fs');

var globAsync = Promise.promisify(glob);
var readVersion = function(filename) {
  return new Promise(function(resolve, reject) {
    fs.readFile(filename, function(err, buf) {
      if (err) return reject(err);
      var pkg = JSON.parse(buf.toString());
      return resolve({name: pkg.name, license: pkg.license});
    });
  });
}

module.exports = function() {
  return globAsync('**/package.json')
    .then(function(filenames) {
      return Promise.all(filenames.map(readVersion))
    })
    .then(function(infos) {
      return infos.reduce(function(acc, info) {
        if (!acc[info.license]) {
          acc[info.license] = [];
        }
        acc[info.license].push(info.name);
        return acc;
      }, {});
    });
};
