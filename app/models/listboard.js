// Listboard schema

var Schema = require('mongoose').Schema,
    _ = require('lodash'),
    validation = require('./validation');


var ListboardSchema = new Schema({
    type: {type: Number, required: true}, //0: now, 1: later, 2: future
    label: { type: String, required: true, trim: true, validate: validation.nonEmpty("Label") },
    containers: [ require('./container') ],

    //For 0 container (associated with a browser)
    lastSyncDate: Date
},{
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
});

ListboardSchema.plugin(require('../util/mongoose-timestamp'));


ListboardSchema.methods.addContainerByFolder = function (folder) {
    return this.addContainer({ type: this.type, title: folder.label, filter: folder.fullPath });
};

ListboardSchema.methods.addContainer = function (cont) {
    this.containers.push({
        type: cont.type,
        title: cont.title,
        filter: cont.filter,
        externalId: cont.externalId,
        cid: cont.cid
    });
    return this;
};

ListboardSchema.methods.removeContainer = function (cont) {
    this.containers.remove(cont);
    return this;
};

ListboardSchema.methods.last = function () {
    return _.last(this.containers);
};

ListboardSchema.methods.getContainerByExternalId = function (externalId) {
    var result = _.filter(this.containers, function(cont){ return cont.externalId === externalId; });
    if(result.length == 1)
        return result[0];
    else if(result.length === 0)
        return null
    else if(result.length > 1)
        throw "Cannot be two containers with same external id on a listboard"
}

ListboardSchema.virtual('cid').get(function() {
  return this._cid;
});

ListboardSchema.virtual('cid').set(function(cid) {
  this._cid = cid;
});

module.exports = ListboardSchema;
