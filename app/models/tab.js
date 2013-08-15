// Tab schema

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    q = require('q');

//There are to types of items: list-item and note-item
var TabSchema = new Schema({
    externalId: {type: String, trim: true},
    title: {type: String, trim: true},
    url: {type: String, trim: true},
    favicon: {type: String, trim: true},
    active: {type: Boolean, default: true},
    lastSyncDate: Date,
    closedDate: Date,
});

TabSchema.plugin(require('../util/mongoose-timestamp'));

module.exports = TabSchema