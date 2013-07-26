// Listboard schema

var Schema = require('mongoose').Schema,
    _ = require('lodash'),
    validation = require('./validation');


var ListboardSchema = new Schema({
    label: { type: String, required: true, trim: true, validate: validation.nonEmpty },
    containers: [ require('./container') ]
});

ListboardSchema.plugin(require('../util/mongoose-timestamp'));


ListboardSchema.methods.addContainerByList = function (list) {
    return this.addContainer({ type: 1, title: list.label, filter: list.fullPath });
};

ListboardSchema.methods.addContainer = function (listObj) {
    this.containers.push({
        type: listObj.type,
        title: listObj.title,
        filter: listObj.filter
    });
    return this;
};

module.exports = ListboardSchema;
