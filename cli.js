#!/usr/bin/env node

var willTheySue = require('./');

willTheySue().then(function(results) {
  console.log(JSON.stringify(results, null, 2));
});
