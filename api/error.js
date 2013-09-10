var _ = require('lodash');
var myUtil = require('./util');

var errors = {
    InvalidRequest: {
        msg: 'invalid_request',
        code: 400
    },
    ServerError: {
        code: 500,
        msg: 'server_error'
    },
    AccessDenied: {
        code: 401,
        msg: 'access_denied'
    },
    UnauthorizedClient: {
        code: 400,
        msg: 'unauthorized_client'
    }
};

var util = require('util');

_.each(errors, function(value, name) {
    var err = function(msg) {
        this.message = msg || 'Error';
        this.http_code = value.code;
    };

    errors[name] = err;

    util.inherits(err, Error);

    err.prototype.name = value.msg;
});

module.exports = errors;

module.exports.redirectError = function(req, res, error) {
    res.redirect(myUtil.urlAppendParams(req.session.oauth2.redirect_uri, {
        'error' : error.name,
        'state' : req.session.oauth2.state
    }));
};

module.exports.sendError = function(res, error) {
    res.send(error.http_code, { error: error.name });
};