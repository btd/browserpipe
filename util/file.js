var Promise = require('bluebird');

var path = require('path'),
  crypto = require('crypto');

var writeFile = Promise.promisify(require("fs").writeFile);
var mkdirp = Promise.promisify(require('mkdirp'));

var config = require('../config');


function randomId(bits) {
  bits = bits || 2;
  return  crypto.pseudoRandomBytes(bits).toString('hex');
}

exports.randomName = function(ext) {
  return path.join(randomId(), randomId(), randomId(), randomId() + ext);
}

exports.fullRandomPath = function(p, ext) {
  return path.join(config.storage.path, p || exports.randomName(ext));
}

exports.mkdirp = function(p) {
  return mkdirp(path.dirname(p));
}

exports.url = function(p) {
  return config.appUrl + path.join(config.storage.url, p);
}

exports.saveData = function saveData(content, ext) {
  var name = exports.randomName(ext);
  var fullPath = path.join(config.storage.path, name);
  return exports.mkdirp(fullPath)
    .then(function() {
      return writeFile(fullPath, content);
    })
    .then(function() {
      return name;
    })
};