var Promise = require('bluebird');

var path = require('path'),
  crypto = require('crypto');

var writeFile = Promise.promisify(require("fs").writeFile);
var mkdirp = Promise.promisify(require('mkdirp'));

var config = require('../config');


function randomId(bits) {
  return  crypto.pseudoRandomBytes(bits).toString('hex');
}
exports.randomName = function(ext) {
  return path.join.apply(path, config.storage.pathConfig.map(randomId)) + ext;
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
  return exports.saveDataByName(content, name);
};

exports.saveDataByName = function(content, name) {
  var fullPath = path.join(config.storage.path, name);
  return exports.mkdirp(fullPath)
    .then(function() {
      return writeFile(fullPath, content);
    })
    .then(function() {
      return name;
    })
}