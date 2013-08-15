// Window schema

var _ = require('lodash'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    q = require('q');

//Note: we do not keep windows inside the browser because there will be many that are 
//no more actve and are use for historical purposes
var WindowSchema = new Schema({        
    browser: {type: Schema.ObjectId, ref: 'Browser'},
    externalId: {type: String, trim: true},
    active: {type: Boolean, default: true},
    lastSyncDate: Date,
    closedDate: Date,
    tabs: [ require('./tab') ]
});

WindowSchema.plugin(require('../util/mongoose-timestamp'));

WindowSchema.methods.addTab = function(rawTab) {    
    this.tabs.push(rawTab);
    return _.last(this.tabs);
};

WindowSchema.statics.getAllActiveByBrowser = function (browser) {
    return this
        .find({browser: browser, active: true}, '_id browser externalId active lastSyncDate closedDate tabs')
        .execWithPromise();
}

WindowSchema.statics.getAllActiveByBrowsers = function (browsers) {
    return this
        .find({browser: {$in: browsers}, active: true}, '_id browser externalId active lastSyncDate closedDate tabs')
        .execWithPromise();
}

WindowSchema.statics.getByExternalId = function (externalId) {
    return this
        .findOne({externalId: externalId}, '_id browser externalId tabs active lastSyncDate closedDate tabs')
        .execWithPromise();
}

WindowSchema.statics.getTabByExternalId = function (id, externalTabId) {
    return this
        .find({_id: id})
        .select({tabs: { $elemMatch: {'externalId': externalTabId} }})
        .execWithPromise();
}

module.exports = Window = mongoose.model('Window', WindowSchema);