var Schema = require('mongoose').Schema,
    validation = require('./validation'),    
    q = require('q');

var ContainerSchema = new Schema({
    type: {type: Number, required: true}, //0: now, 1: later, 2: future
    title: {type: String, trim: true, required: true, validate: validation.nonEmpty("Title")},
    
    //For 0 container (associated with a window)
    externalId: {type: String, trim: true},
    lastSyncDate: Date,
    closedDate: Date,

    //For 2 container (future containers)
    filter: {type: String, trim: true}
});

ContainerSchema.plugin(require('../util/mongoose-timestamp'));

module.exports = ContainerSchema;
