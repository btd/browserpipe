var crypto = require('crypto');

var config = require('../config/config');
var error = require('./error');

//TODO log errors

module.exports.generateAuthCode = function(callback) {
    crypto.randomBytes(config.oauth2.authCode.length, function (ex, buffer) {
        if (ex) return callback(new error.ServerError(ex.message));

        callback(false, crypto.createHash('sha1').update(buffer).digest('hex'));
    });
};

module.exports.generateAccessToken = function(callback) {
    crypto.randomBytes(config.oauth2.accessToken.length, function (ex, buffer) {
        if (ex) return callback(new error.ServerError(ex.message));

        callback(false, crypto.createHash('sha512').update(buffer).digest('hex'));
    });
};