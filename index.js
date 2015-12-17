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
      if (!pkg.name || !pkg.license) return resolve(null);
      var license = pkg.license.type || pkg.license;
      return resolve({name: pkg.name, license: license});
    });
  });
}

module.exports = function() {
  return globAsync('**/node_modules/*/package.json')
    .then(function(filenames) {
      return Promise.all(filenames.map(readVersion))
    })
    .then(function(infos) {
      return infos.reduce(function(acc, info) {
        if (info) {
          if (!acc[info.license]) {
            acc[info.license] = {};
          }
          acc[info.license][info.name] = true;
        }
        return acc;
      }, {});
    })
    .then(function(resultsAsMap) {
      return Object.keys(resultsAsMap).reduce(function(acc, license) {
        acc[license] = Object.keys(resultsAsMap[license]).sort();
        return acc;
      }, {});
    });
    ;
};
