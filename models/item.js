// Item schema

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var Item;

//There are to types of items: folder-item and note-item
var ItemSchema = new Schema({
  // sub items - for folder like behaviour
  items: [
    { type: Schema.ObjectId, ref: 'Item '}
  ],

  // archive
  archiveParent: { type: Schema.ObjectId, ref: 'Item' }, //parent folder, if sets it means it is archived

  // browser
  browserParent: { type: Schema.ObjectId, ref: 'Item' }, // parent in browser, if sets it means that is in browser

  // pin
  pinned: { type: Boolean, default: false }, //This means that is pinned in the browser

  // history
  previous: { type: Schema.ObjectId, ref: 'Item' }, //previous item navigated
  next: { type: Schema.ObjectId, ref: 'Item' }, //next item navigated

  // owner
  user: { type: Schema.ObjectId, ref: 'User' },

  // type of item // 0 - bookmark, 1 - note, 2 - container
  type: { type: Number, required: true }, //0: bookmark, 1: note

  // when type 0
  favicon: { type: String, trim: true },
  screenshot: { type: String, trim: true },
  url: { type: String, trim: true },

  windowWidth: { type: Number }, //Width of client window
  windowHeight: { type: Number }, //Height of client window

  // only for browsers
  externalId: { type: String, trim: true },
  browserKey: { type: String, trim: true },
  lastSync: { type: Date },

  // common for all types
  title: { type: String, trim: true },

  // scroll position
  scrollX: { type: Number },
  scrollY: { type: Number },

  // trash
  deleted: { type: Boolean, default: false },

  statusCode: { type: Number }, //http response code

  // this is a path inside storage - it does not contain whole path with storage prefix
  path: { type: String }
}, {
  toObject: { virtuals: true },
  toJSON: { virtuals: true }
});

ItemSchema.plugin(require('../util/mongoose-timestamp'));


['Bookmark', 'Note', 'Container'].forEach(function(elem, index) {
  ItemSchema.methods['is' + elem] = function() {
    return this.type === index;
  };

  ItemSchema.statics['new' + elem] = function(obj) {
    obj.type = index;
    return new Item(obj);
  };

  /*ItemSchema.methods['add' + elem] = function(obj) {
    var item = new Item(obj);
    item.type = index;
    item.parent = this._id;
    item.user = this.user;
    this.items.push(item._id);//TODO maybe add after save?
    return item;
  };*/
});

var file = require('../util/file');

ItemSchema.virtual('storageUrl').get(function() {
  return this.path && file.url(this.path);
});

//TODO: for security reasons we should not use byId in the server but byIdAndUserId
ItemSchema.statics.byId = function(id) {
  return Item.by({ _id: id});
};

ItemSchema.statics.by = function(query) {
  return Item
    .findOne(query)
    .exec();
};


ItemSchema.statics.all = function(query) {
  return Item
    .find(query)
    .exec();
}

module.exports = Item = mongoose.model('Item', ItemSchema);
