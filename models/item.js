// Item schema

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Item;

//There are to types of items: folder-item and note-item
var ItemSchema = new Schema({
    type: {type: Number, required: true}, //0: bookmark, 1: note
    user: {type: Schema.ObjectId, ref: 'User'},
    favicon: {type: String, trim: true},
    screenshot: {type: String, trim: true},
    title: {type: String, trim: true},
    url: {type: String, trim: true},
    note: {type: String, trim: true},

    //For 0 type (associated with a tab)
    //TODO: if in the future we have one item per URL, do we need a folder of externalId?
    externalId: {type: String, trim: true}

},{
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
});

ItemSchema.plugin(require('../util/mongoose-timestamp'));

ItemSchema.statics.getByExternalId = function (user, externalId) {
    return this
        .findOne({user: user, externalId: externalId}, '_id type title favicon screenshot url note externalId')
        .execWithPromise();
}

ItemSchema.statics.byId = function (id) {
    return qfindOne({ _id: id});
}

ItemSchema.statics.getAll = function (user) {
    return this
        .find({user: user}, '_id type title favicon screenshot url note externalId')        
        .execWithPromise();
}

var qfindOne = function (obj) {
    return Item
            .findOne(obj)            
            .execWithPromise();
};

ItemSchema.statics.by = qfindOne;

module.exports = Item = mongoose.model('Item', ItemSchema);
