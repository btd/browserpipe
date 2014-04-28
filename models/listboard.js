// Listboard schema
/*
var Schema = require('mongoose').Schema,
    _ = require('lodash'),
    Item = require('./item');


var ListboardSchema = new Schema({
    type: {type: Number, required: true}, //0: browser, 1: custom listboard

    title: { type: String, trim: true },
    containers: [ {  type: Schema.ObjectId, ref: 'Item' }],

    //For 0 container (associated with a browser)
    browserKey: { type: String },
    lastSyncDate: { type: Date }
},{
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
});

ListboardSchema.plugin(require('../util/mongoose-timestamp'));

ListboardSchema.methods.addContainer = function (cont) {
    var item = Item.newContainer({ user: cont.user, title: cont.title, externalId: cont.externalId })
    this.containers.push(item._id);
    return item;
};

ListboardSchema.methods.removeContainer = function (cont) {
    this.containers.remove(cont);
    return this;
};

ListboardSchema.methods.last = function () {
    return _.last(this.containers);
};

ListboardSchema.methods.getContainerByExternalId = function (externalId) {
    var result = _.filter(this.containers, function( cont ){ return cont.externalId === externalId; });
    if (result.length === 1)
        return result[0];
    else if (result.length === 0)
        return null
    else if (result.length > 1)
        throw new Error("Cannot be two containers with same external id on a listboard")
}

module.exports = ListboardSchema;*/
