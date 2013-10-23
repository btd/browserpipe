var express = require('express'),
    _ = require('lodash'),
    error = require('./error');

var AccessToken = require('../app/models/accessToken');


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
            .fail(error.sendIfFailed(res));
    } else {
        error.sendError(res, new error.InvalidRequest('access_token query parameter missing or invalid'));
    }
};


module.exports = function (app) {
    //this one will check all routes has access_token query param, we can think to use instead X-Access-Token header or similar
    app.namespace('/v1', hasValidAccessToken, express.json(), function () {
        //define routes there

        app.get('/token', function (req, res) {
            //this is just to for tests
            res.send(req.accessToken.toJSON());
        });

        require('./routes/browsers')(app);
    })

    //this can be routes without
}