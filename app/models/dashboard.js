// Dashboard schema

var mongoose = require('mongoose'),
    _ = require('lodash'),
    Schema = mongoose.Schema,
    validation = require('./validation'),
    Q = require('q')

var DashboardSchema = new Schema({
    label: {type: String, required: true, trim: true, validate: validation.nonEmpty },
    containers: [
        {
            type: {type: Number, required: true}, //0: blank, 1: tag, 2: search, 3: import, 4: device, 5: trash
            title: {type: String, trim: true, required: true, validate: validation.nonEmpty},
            filter: {type: String, trim: true, required: true}
        }
    ],
    user: {type: Schema.ObjectId, ref: 'User'}
});

DashboardSchema.plugin(require('mongoose-timestamp'));


DashboardSchema.methods.addContainerByTag = function (tag) {
    return this.addContainer({ type: 1, title: tag.label, filter: tag.fullPath });
};

DashboardSchema.methods.addContainer = function (tagObj) {
    this.containers.push({
        type: tagObj.type,
        title: tagObj.title,
        filter: tagObj.filter
    });
    return this;
};


DashboardSchema.statics.getAll = function (user) {
    return this
        .find({ user: user })
        .select('_id label containers')
        .execWithPromise();
}

module.exports = Dashboard = mongoose.model('Dashboard', DashboardSchema);
