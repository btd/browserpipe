// Listboard schema

var mongoose = require('mongoose'),
    _ = require('lodash'),
    Schema = mongoose.Schema,
    validation = require('./validation'),
    Q = require('q')

var ListboardSchema = new Schema({
    label: {type: String, required: true, trim: true, validate: validation.nonEmpty },
    containers: [
        {
            type: {type: Number, required: true}, //0: blank, 1: list, 2: search, 3: import, 4: device, 5: trash
            title: {type: String, trim: true, required: true, validate: validation.nonEmpty},
            filter: {type: String, trim: true, required: true}
        }
    ],
    user: {type: Schema.ObjectId, ref: 'User'}
});

ListboardSchema.plugin(require('mongoose-timestamp'));


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


ListboardSchema.statics.getAll = function (user) {
    return this
        .find({ user: user })
        .select('_id label containers')
        .execWithPromise();
}

module.exports = Listboard = mongoose.model('Listboard', ListboardSchema);
