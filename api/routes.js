var express = require('express'),
    _ = require('lodash'),
    error = require('./error');

var Application = require('../app/models/application'),
    User = require('../app/models/user'),
    AuthCode = require('../app/models/authCode'),
    AccessToken = require('../app/models/accessToken');


var hasValidAccessToken = function (req, res, next) {
    var accessTokenValue = req.query.access_token;

    if (_.isString(accessTokenValue) && accessTokenValue.length > 0) {
        AccessToken.by({ value: accessTokenValue })
            .then(function (accessToken) {
                if (accessToken) {
                    //TODO we can save number of requests
                    req.accessToken = accessToken;
                    next();
                } else {
                    error.sendError(res, new error.AccessDenied());
                }
            })
            .fail(function (err) {
                error.sendError(res, new error.ServerError(err.message));
            });
    } else {
        error.sendError(res, new error.InvalidRequest());
    }
};

module.exports = function (app) {
    //this one will check all routes has access_token query param, we can think to use instead X-Access-Token header or similar
    app.namespace('/v1', hasValidAccessToken, function () {
        //define routes there

        app.get('/token', function (req, res) {
            res.send(req.accessToken.toJSON());
        });
    });

    //this can be routes without
}