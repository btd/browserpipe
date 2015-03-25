// Item schema

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var Promise = require('bluebird');

var Item;

var FileSchema = new Schema({
  name: String,
  size: Number
});

//There are to types of items: folder-item and note-item
var ItemSchema = new Schema({
  // owner
  user: { type: Schema.ObjectId, ref: 'User' },

  deleted: { type: Boolean, default: false },

  favicon: { type: String, trim: true }, // url to favicon
  screenshot: { type: String, trim: true }, //url to screenshot
  url: { type: String, trim: true }, // url itself

  // not used now
  windowWidth: { type: Number }, //Width of client window
  windowHeight: { type: Number }, //Height of client window

  // common for all types
  title: { type: String, trim: true },

  // scroll position
  scrollX: { type: Number },
  scrollY: { type: Number },

  tags: [ { type: String, trim: true } ],

  statusCode: { type: Number }, //http response code

  // this is a path inside storage - it does not contain whole path with storage prefix
  path: { type: String },
  files: [ FileSchema ]
}, {
  toObject: { virtuals: true },
  toJSON: { virtuals: true }
});

ItemSchema.plugin(require('../util/mongoose-timestamp'));
ItemSchema.plugin(require('../util/mongoose-query'));
ItemSchema.plugin(require('../util/mongoose-patch'));

var file = require('../util/file');

ItemSchema.virtual('storageUrl').get(function() {
  return this.path && file.url(this.path);
});

/**
f it is object with name and size properties
*/
ItemSchema.methods.addFile = function(f) {
  this.files.push(f);
  return this;
};

ItemSchema.statics.allTags = function() {
  return Promise.resolve(Item.aggregate()
    .project({ tags: 1, _id: 0 })
    .unwind('tags')
    .group({ _id: '$tags' })
    .exec());
};

module.exports = Item = mongoose.model('Item', ItemSchema);
