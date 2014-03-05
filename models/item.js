// Item schema

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var StorageItem = require('./storage-item');

var Item;

//There are to types of items: folder-item and note-item
var ItemSchema = new Schema({
  // sub items - for folder like behaviour
  items: [
    { type: Schema.ObjectId, ref: 'Item '}
  ],
  parent: { type: Schema.ObjectId, ref: 'Item' }, // not sure if it is need, but it seems it is easy to maintain it
  previous: { type: Schema.ObjectId, ref: 'Item' }, //previous item navigated
  next: { type: Schema.ObjectId, ref: 'Item' }, //next item navigated

  visible: { type: Boolean, default: true },

  // owner
  user: { type: Schema.ObjectId, ref: 'User' },

  // type of item // 0 - bookmark, 1 - note, 2 - container
  type: { type: Number, required: true }, //0: bookmark, 1: note

  // when type 0
  favicon: { type: String, trim: true },
  screenshot: { type: String, trim: true },
  url: { type: String, trim: true },

  // only for browsers
  externalId: { type: String, trim: true },
  browserKey: { type: String, trim: true },
  lastSync: { type: Date },

  // common for all types
  title: { type: String, trim: true },

  deleted: { type: Boolean, default: false },

  storageItem: { type: Schema.ObjectId, ref: 'StorageItem' }
}, {
  toObject: { virtuals: true },
  toJSON: { virtuals: true }
});

ItemSchema.plugin(require('../util/mongoose-timestamp'));
ItemSchema.plugin(require('mongoose-text-search'));

ItemSchema.index(
  {
    title: 'text',
    url: 'text',
    html: 'text'
  }
);

['Bookmark', 'Note', 'Container'].forEach(function(elem, index) {
  ItemSchema.methods['is' + elem] = function() {
    return this.type === index;
  };

  ItemSchema.statics['new' + elem] = function(obj) {
    obj.type = index;
    return new Item(obj);
  };

  ItemSchema.methods['add' + elem] = function(obj) {
    var item = new Item(obj);
    item.type = index;
    item.parent = this._id;
    item.user = this.user;
    this.items.push(item._id);//TODO maybe add after save?
    return item;
  };
});


ItemSchema.statics.byUserAndExternalId = function(user, externalId) {
  return Item
    .by({ user: user, externalId: externalId })
    .select('_id items parent previous next visible user type favicon screenshot url externalId browserKey lastSync title deleted'); //We exclude html to speed up
};

//TODO: for security reasons we should not use byId in the server but byIdAndUserId
ItemSchema.statics.byId = function(id) {
  return Item.by({ _id: id});
};

ItemSchema.statics.by = function(query) {
  return Item
    .findOne(query)
    .select('_id items parent previous next visible user type favicon screenshot url externalId browserKey lastSync title deleted storageItem')
    .exec();
};

ItemSchema.statics.getHtml = function(id) {
  return Item
      .findOne({ _id: id})
      .select('_id url storageItem')
      .exec()
      .then(function(item) {
        if(item) {
          return StorageItem.by({ _id: item.storageItem });
        }
      })
};

ItemSchema.statics.all = function(query) {
  return Item
    .find(query)
    .select('_id items parent previous next visible user type favicon screenshot url externalId browserKey lastSync title deleted')
    .exec();
}
module.exports = Item = mongoose.model('Item', ItemSchema);
