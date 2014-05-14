// Item schema

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var Item;

var FileSchema = new Schema({
  name: String,
  size: Number
})

//There are to types of items: folder-item and note-item
var ItemSchema = new Schema({
  // sub items - for folder like behaviour
  items: [
    { type: Schema.ObjectId, ref: 'Item' }
  ],

  //parent
  parent: { type: Schema.ObjectId, ref: 'Item' }, //parent item

  // pin
  pinned: { type: Boolean, default: false }, //This means that is pinned in the browser

  // owner
  user: { type: Schema.ObjectId, ref: 'User' },

  // type of item // 0 - bookmark, 1 - note, 2 - container
  type: { type: Number, required: true }, //0: bookmark, 1: note

  // when type 0
  favicon: { type: String, trim: true },
  screenshot: { type: String, trim: true },
  url: { type: String, trim: true },

  // not used now
  windowWidth: { type: Number }, //Width of client window
  windowHeight: { type: Number }, //Height of client window

  // common for all types
  title: { type: String, trim: true },

  // scroll position
  scrollX: { type: Number },
  scrollY: { type: Number },

  // trash
  deleted: { type: Boolean, default: false },

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

['Bookmark', 'Note', 'Container'].forEach(function(elem, index) {
  ItemSchema.methods['is' + elem] = function() {
    return this.type === index;
  };

  ItemSchema.statics['new' + elem] = function(obj) {
    obj.type = index;
    return new Item(obj);
  };
});

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
}

//TODO: for security reasons we should not use byId in the server but byIdAndUserId
// grep by Item.byId

module.exports = Item = mongoose.model('Item', ItemSchema);
