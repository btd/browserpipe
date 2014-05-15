var config = require('./config');
var mongoose = require('mongoose');
var Promise = require('bluebird');

var file = require('./util/file');

var exec = Promise.promisify(require('child_process').execFile);

mongoose.connect(config.db.uri, function() {
  var Item = require('./models/item');
  console.log('connected to mongo');

  return Item.all()
    .then(function(items) {
      console.log('got all items');
      return Promise.all(items.map(function(item) {
        item.path = null;
        item.files = [];

        return item.saveWithPromise();
      }))
    })
    .then(function() {
      console.log('removing storage');
      return exec('rm', ['-fr', config.storage.path]);
    })
    .then(function() {
      process.exit(0);
    })
});