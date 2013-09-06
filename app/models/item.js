// Item schema

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    q = require('q');

//There are to types of items: list-item and note-item
var ItemSchema = new Schema({
    type: {type: Number, required: true},//0: now, 1: later, 2: future
    lists: [
        {type: String, trim: true}
    ],
    containers: [
        {type: Schema.ObjectId, ref: 'Container'}
    ],
    user: {type: Schema.ObjectId, ref: 'User'},
    favicon: {type: String, trim: true},
    title: {type: String, trim: true},
    url: {type: String, trim: true},
    note: {type: String, trim: true},

    //For 0 type (associated with a tab)
    externalId: {type: String, trim: true},
    active: {type: Boolean, default: true},
    closedDate: Date

},{
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
});

ItemSchema.plugin(require('../util/mongoose-timestamp'));

ItemSchema.statics.findActiveByContainer = function (user, containerId) {
    return this
        .find({user: user, containers: containerId, active: true}, '_id type containers lists title favicon url note externalId active closedDate')
        .execWithPromise();
}

ItemSchema.statics.getActiveByExternalId = function (user, externalId) {
    return this
        .findOne({user: user, externalId: externalId, active: true}, '_id type containers lists title favicon url note externalId active closedDate')
        .execWithPromise();
}

ItemSchema.statics.getByExternalId = function (user, externalId) {
    return this
        .findOne({user: user, externalId: externalId}, '_id type containers lists title favicon url note externalId active closedDate')
        .execWithPromise();
}

ItemSchema.statics.findAllActiveByContainers = function (user, containerIds) {
    return this
        .find({user: user, containers: {$in: containerIds}, active: true}, '_id type containers lists title favicon url note externalId active closedDate')
        .execWithPromise();
}

ItemSchema.statics.findAllByContainers = function (user, containerIds) {
    return this
        .find({user: user, containers: {$in: containerIds}}, '_id type containers lists title favicon url note externalId active closedDate')
        .execWithPromise();
}


ItemSchema.statics.findAllActiveByFilters = function (user, filters) {
    return this
        .find({user: user, lists: {$in: filters}, active: true}, '_id type containers lists title favicon url note externalId active closedDate')
        .execWithPromise();
}

ItemSchema.statics.removeAllByFilters = function (user, filters) {
    return this
        .remove({user: user, lists: {$in: filters}})
        .execWithPromise();
}

ItemSchema.virtual('cid').get(function() {
  return this._cid;
});

ItemSchema.virtual('cid').set(function(cid) {
  return this._cid = cid;
});


module.exports = Item = mongoose.model('Item', ItemSchema);
