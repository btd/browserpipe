var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    url = require('url'),
    _ = require('lodash'),
    generateRandomString = require('../util/security').generateRandomString;

var Application;

var ApplicationSchema = new Schema({
    name: { type: String, required: true, trim: true },
    client_id: { type: String, trim: true },
    client_secret: { type: String, trim: true },
    redirect_uri: [ { type: String, required: true} ]
});

ApplicationSchema.plugin(require('../util/mongoose-timestamp'));

ApplicationSchema.statics.byClientId = function (client_id) {
    return Application.findOne({ client_id: client_id}).execWithPromise();
};

ApplicationSchema.statics.by = function(findQuery) {
    return Application.findOne(findQuery).execWithPromise();
};

ApplicationSchema.path('redirect_uri').validate(function(value) {
    if(value.length === 0) return false;

    for(var i = 0, length = value.length; i < length; i++) {
        if(!Application.redirectableUri(value[i], true)) return false;
    }
    return true;
}, ' urls empty or not valid');

ApplicationSchema.statics.redirectableUri = function(value, shouldHasQuery) {
    var parsedUrl = url.parse(value);
    return _.isString(parsedUrl.protocol) && /https?:/.test(parsedUrl.protocol) &&
        _.isString(parsedUrl.host) && parsedUrl.host.length > 0 &&
        ((shouldHasQuery && !parsedUrl.query) || !shouldHasQuery ); // this seems enough
};

ApplicationSchema.methods.hasRedirectUri = function(redirect_uri) {
    return _.any(this.redirect_uri, function(ru) {
        var parsedUrl = url.parse(redirect_uri), parsedRU = url.parse(ru);
        return parsedUrl.protocol === parsedRU.protocol &&
            parsedUrl.host === parsedRU.host &&
            parsedUrl.pathname === parsedRU.pathname; //this should be enough
    });
};

ApplicationSchema.pre('save', true, function (next, done) {
    var that = this;
    next();

    if(this.client_id) {
        done();
    } else {
        generateRandomString()
            .then(function(token) {
                that.client_id = token;
                done();
            })
            .fail(done)
    }
});

ApplicationSchema.pre('save', true, function (next, done) {
    var that = this;
    next();
    
    if(this.client_secret) {
        done();
    } else {
        generateRandomString()
            .then(function(token) {
                that.client_secret = token;
                done();
            })
            .fail(done)
    }
});


module.exports = Application = mongoose.model('Application', ApplicationSchema);
