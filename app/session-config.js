var connectSession = require('connect-session'),
    session = connectSession.session,
    header = connectSession.header;

var _ = require('lodash');

var config = require('../config/config');

//you should replace this one with other store (but this used by default)
var MongoStore = require('connect-mongodb');

var loaders = [
    header({
        header: 'X-User-Session' //this used by default, so you can skip this
    })
];

var options = {
    store: new MongoStore({
        url: config.db.uri,
        collection : 'sessions'
    })
}

module.exports.sessionCreate = session(loaders, options);

module.exports.sessionLoad = session(loaders, _.extend(options, {
    generateOnMissingSID: false
}));