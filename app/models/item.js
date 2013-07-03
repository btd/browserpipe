// Item schema

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    q = require('q')

//There are to types of items: tag-item and note-item
var ItemSchema = new Schema({
    type: {type: Number, trim: true},//0: bookmark, 1: note
    tags: [
        {type: String, trim: true}
    ],
    user: {type: Schema.ObjectId, ref: 'User'},
    createdAt: {type: Date, default: Date.now},
    //tag-item
    title: {type: String, trim: true},
    url: {type: String, trim: true},
    //note-item & tag-item
    note: {type: String, trim: true}
})

ItemSchema.methods.saveWithPromise = function () {
    var deferred = q.defer();
    this.save(function (err) {
        if (err) deferred.reject(err)
        else deferred.resolve()
    })
    return deferred.promise;
}

ItemSchema.statics.getAllByFilters = function (user, filters) {
    var deferred = q.defer();
    this
        .find({user: user, tags: {$in: filters}}, '_id type tags title url note')
        .exec(function (err, items) {
            // TODO manage errors propertly
            if (err) throw err;
            else deferred.resolve(items);
        })
    return deferred.promise;
}

mongoose.model('Item', ItemSchema)
