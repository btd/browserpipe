
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
  contentLength: Number,
  lastModified: Date,
  name: String,
  url: String,
  user: { type: Schema.ObjectId, ref: 'User' }
});

StorageItemSchema.plugin(require('../util/mongoose-timestamp'));

StorageItemSchema.methods.getContent = function() {
  return fs.readFileAsync(path.join(config.storage.path, this.name), "utf8");
};

StorageItemSchema.methods.getUrl = function() {
  return config.appUrl + '/storage-item/' + this._id.toString();
};

var qfindOne = function (obj) {
  return StorageItem
    .findOne(obj)
    .exec();
};

StorageItemSchema.statics.by = qfindOne;

module.exports = StorageItem = mongoose.model('StorageItem', StorageItemSchema);
