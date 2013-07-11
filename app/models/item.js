// Item schema

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    q = require('q')

//There are to types of items: list-item and note-item
var ItemSchema = new Schema({
    type: {type: Number, trim: true},//0: bookmark, 1: note
    lists: [
        {type: String, trim: true}
    ],
    user: {type: Schema.ObjectId, ref: 'User'},
    createdAt: {type: Date, default: Date.now},
    //list-item
    title: {type: String, trim: true},
    url: {type: String, trim: true},
    //note-item & list-item
    note: {type: String, trim: true}
})

ItemSchema.statics.getAllByFilters = function (user, filters) {
    var deferred = q.defer();
    this
        .find({user: user, lists: {$in: filters}}, '_id type lists title url note')
        .exec(function (err, items) {
            // TODO manage errors propertly
            if (err) throw err;
            else deferred.resolve(items);
        })
    return deferred.promise;
}

mongoose.model('Item', ItemSchema)
