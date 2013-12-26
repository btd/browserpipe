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
    parent: { type: Schema.ObjectId, ref: 'Item' }, // not sure if it is need, but it seems it is easy to maintain it

    // owner
    user: { type: Schema.ObjectId, ref: 'User' },

    // type of item // 0 - bookmark, 1 - note, 2 - container
    type: { type: Number, required: true }, //0: bookmark, 1: note

    // when type 0
    favicon: { type: String, trim: true },
    screenshot: { type: String, trim: true },
    url: { type: String, trim: true },

    // only for top level items
    externalId: { type: String, trim: true },
    browserKey: { type: String, trim: true },
    lastSync: { type: Date },

    // common for all types
    title: { type: String, trim: true },

    // when type 2
    note: { type: String, trim: true } //TODO maybe combine note and url?
},{
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
});

ItemSchema.plugin(require('../util/mongoose-timestamp'));
ItemSchema.plugin(require('mongoose-text-search'));

ItemSchema.index(
    { 
        title: 'text', 
        url: 'text', 
        note: 'text'
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

ItemSchema.statics.byUserAndExternalId = function (user, externalId) {
    return Item.by({ user: user, externalId: externalId });
};

ItemSchema.statics.byId = function (id) {
    return Item.by({ _id: id});
};

ItemSchema.statics.by = function (query) {
    return Item
        .findOne(query)
        .execWithPromise();
};

ItemSchema.statics.all = function(query) {
    return Item
        .find(query)
        .execWithPromise();
}
module.exports = Item = mongoose.model('Item', ItemSchema);
