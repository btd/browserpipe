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
    index: type: {type: Number, required: true}
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

ItemSchema.statics.removeAllByContainers = function(user, containerIds) {
    return Item.findAllByContainers(user, containerIds)
        .then(function(items) {
            var promises = _.map(items, function(item) {                            
                _.each(containerIds, function(containerId) {
                    item.containers.remove(containerId);
                });                 
                return item.saveWithPromise();
            });
            return q.all(promises);
        });
}

ItemSchema.statics.removeAllByFolders = function(user, folderIds, deltaItems) {
    return Item.findAllByFolders(user, folderIds)
        .then(function(items) {
            var promises = _.map(items, function(item) {                            
                deltaItems.data.push(item);
                _.each(folderIds, function(folderId) {
                    item.folders.remove(folderId);
                });                 
                return item.saveWithPromise();
            });
            return q.all(promises);
        });
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

module.exports = Item = mongoose.model('Item', ItemSchema);
