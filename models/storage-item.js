
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  validation = require('./validation');

var Promise = require('bluebird');

var fs = Promise.promisifyAll(require("fs"));
var config = require('../config');
var path = require('path');

var StorageItem;

var StorageItemSchema = new Schema({
  contentType: String,
  contentLength: String,
  lastModified: Date,
  name: String,
  url: String
});

StorageItemSchema.plugin(require('../util/mongoose-timestamp'));

StorageItemSchema.methods.getContent = function() {
  return fs.readFileAsync(path.join(config.storage.path, this.name), "utf8");
};

var qfindOne = function (obj) {
  return StorageItem
    .findOne(obj)
    .execWithPromise();
};

StorageItemSchema.statics.by = qfindOne;

module.exports = StorageItem = mongoose.model('StorageItem', StorageItemSchema);
