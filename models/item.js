// Item schema

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    q = require('q'),
    _ = require('lodash');

//There are to types of items: folder-item and note-item
var ItemSchema = new Schema({
    type: {type: Number, required: true}, //0: bookmark, 1: note
    folders: [
        {type: Schema.ObjectId, ref: 'Folder'}
    ],
    containers: [
        {type: Schema.ObjectId, ref: 'Container'}
    ],
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
        .findOne({user: user, externalId: externalId}, '_id type containers folders title favicon screenshot url note externalId')
        .execWithPromise();
}

ItemSchema.statics.getByExternalId = function (user, externalId) {
    return this
        .findOne({user: user, externalId: externalId}, '_id type containers folders title favicon screenshot url note externalId')
        .execWithPromise();
}

ItemSchema.statics.findByContainer = function (user, containerId) {
    return this
        .find({user: user, containers: containerId}, '_id type containers folders title favicon screenshot url note externalId')
        .execWithPromise();
}

ItemSchema.statics.findAllByContainers = function (user, containerIds) {
    return this
        .find({user: user, containers: {$in: containerIds}}, '_id type containers folders title favicon screenshot url note externalId')
        .execWithPromise();
}

ItemSchema.statics.findAllByFolders = function (user, folderIds) {
    return this
        .find({user: user, folders: {$in: folderIds}}, '_id type containers folders title favicon screenshot url note externalId')
        .execWithPromise();
}

ItemSchema.statics.byId = function (id) {
    return qfindOne({ _id: id});
}

var qfindOne = function (obj) {
    return Item
            .findOne(obj)
            //.findOne(obj, '_id type containers folders title favicon screenshot url note externalId') //TODO: why is this not finding the item????
            .execWithPromise();
};

ItemSchema.statics.by = qfindOne;

module.exports = Item = mongoose.model('Item', ItemSchema);
