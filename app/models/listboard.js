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
});

ListboardSchema.plugin(require('../util/mongoose-timestamp'));


ListboardSchema.methods.addContainerByList = function (list) {
    return this.addContainer({ type: this.type, title: list.label, filter: list.fullPath });
};

ListboardSchema.methods.addContainer = function (cont) {
    this.containers.push({
        type: cont.type,
        title: cont.title,
        filter: cont.filter,
        externalId: cont.externalId,
        active: cont.active
    });
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

module.exports = ListboardSchema;
