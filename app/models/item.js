// Item schema

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    q = require('q');

//There are to types of items: list-item and note-item
var ItemSchema = new Schema({
    type: {type: Number, required: true},//0: bookmark, 1: note
    lists: [
        {type: String, trim: true}
    ],
    user: {type: Schema.ObjectId, ref: 'User'},
    //list-item
    title: {type: String, trim: true},
    url: {type: String, trim: true},
    //note-item & list-item
    note: {type: String, trim: true}
});

ItemSchema.plugin(require('../util/mongoose-timestamp'));

ItemSchema.statics.findAllByFilters = function (user, filters) {
    return this
        .find({user: user, lists: {$in: filters}}, '_id type lists title url note')
        .execWithPromise();
}

ItemSchema.statics.removeAllByFilters = function (user, filters) {
    return this
        .remove({user: user, lists: {$in: filters}})
        .execWithPromise();
}


module.exports = Item = mongoose.model('Item', ItemSchema);
