var express = require('express'),
    _ = require('lodash'),
    mongoStore = require('connect-mongo')(express);

var config = require('../config/config'),
    util = require('./util'),
    error = require('./error');

var Application = require('../app/models/application'),
    User = require('../app/models/user'),
    AuthCode = require('../app/models/authCode'),
    AccessToken = require('../app/models/accessToken');

var generateRandomString = require('../app/util/security').generateRandomString;

//middleware required for authorization part
var cookieParser = express.cookieParser();

var session = express.session({
    secret: '18ee75a4720f85773ae9fa0756d806604815b65e62edde39402e86589aeb6ba5',
    store: new mongoStore(config["connect-mongo"]),
    cookie: { path: '/oauth2/auth' }
});
var csrf = express.csrf();

var oauthSession = function(req, res, next) {
    if(!req.session.oauth2) {
        return res.send(403);
    }
    next();
};

var authorized = function(req, res, next) {
    if(!req.session.username) return res.send(401);

    User.byEmail(req.session.username)
        .then(function(user) {
            if(user) {
                req.user = user;
                next();
            } else {
                res.send(403);
            }
        }, next);
};

/*jshint unused:true, eqnull:true */
var nonEmptyString = function(value) {
    return value != null && _.isString(value) && value.length > 0;
};

var isCode = function(a) {
    return a === 'code';
};


var and = function(funcs) {
    return function(v) {
        var ok = true;
        for(var i = 0, len = funcs.length; i < len && ok; i++ ) {
            ok = ok && funcs[i](v);
        }
        return ok;
    };
};

var ifPresentedThenNonEmpty = function(value) {
    return value == null ? true : nonEmptyString(value);
};

var validateAuthorizationParams = _.pairs({
    'redirect_uri': [nonEmptyString, Application.redirectableUri],
    'client_id': [nonEmptyString],
    'response_type': [isCode],
    'state': [ifPresentedThenNonEmpty]
});

validateAuthorizationParams = _.map(validateAuthorizationParams, function(p) {
    return [p[0], and(p[1])];
});

module.exports = function(app) {

    app.namespace('/oauth2/auth', express.urlencoded(), cookieParser, session, function() {
        app.get('/', function(req, res) {
            var invalidParam = _.find(validateAuthorizationParams, function(prop) {
                return !prop[1](req.query[prop[0]]);
            });

            if(invalidParam) {
                res.status(400).render('error', {
                    param: invalidParam[0]
                });
            } else {
                Application.by({ client_id: req.query.client_id })
                    .then(function(application) {
                        if(application && application.hasRedirectUri(req.query.redirect_uri)) {

                            req.session.oauth2 = {
                                state: req.query.state,
                                redirect_uri: req.query.redirect_uri,
                                client_id: req.query.client_id
                            };

                            res.redirect('./login');

                        } else {
                            res.status(400).render('error', {
                                param: 'client_id'
                            });
                        }
                    })
                    .fail(function() {
                        res.status(400).render('error', {
                            param: 'client_id'
                        });
                    });
            }
        });

        app.get('/login', csrf, oauthSession, function(req, res) {
            if(req.session.username) {
                res.redirect('../requestAccess');
                //TODO if app already authorized redirect immediate
            }

            res.render('auth', {
                _csrf: req.csrfToken(),
                error: req.query.error
            });
        });

        app.post('/loginAuth', csrf, oauthSession, function(req, res) {
            if(req.is('application/x-www-form-urlencoded') && req.body && nonEmptyString(req.body.username) && nonEmptyString(req.body.password)) {
                User.byEmail(req.body.username)
                    .then(function (user) {
                        if (!user || !user.authenticate(req.body.password)) {
                            return res.redirect('../login?error=invalid_user');
                        }

                        req.session.username = req.body.username;
                        res.redirect('../requestAccess');
                    })
                    .fail(function() {
                        return res.redirect('../login?error=invalid_user');
                    });
            } else {
                res.redirect('../login?error=invalid_user');//TODO something else ?
            }

        });

        app.get('/requestAccess', csrf, oauthSession, authorized, function(req, res) {
            Application.byClientId(req.session.oauth2.client_id)
                .then(function(app) {
                    if(app) {
                        res.render('requestAccess', {
                            app: app,
                            _csrf: req.csrfToken()
                        });
                    } else {
                        error.redirectError(req, res, new error.UnauthorizedClient());
                    }
                })
                .fail(function(err) {
                    error.redirectError(req, res, new error.ServerError(err.message));
                });
        });

        app.post('/requestAccessAuth', csrf, oauthSession, authorized, function(req, res) {
            if(req.is('application/x-www-form-urlencoded') &&
                req.body) {
                if(req.body.result === 'Yes') {

                    Application.byClientId(req.session.oauth2.client_id)
                        .then(function(application) {
                            AuthCode.byUserAndApplication(req.user, application)
                                .then(function(authCode) {
                                    if(authCode && !authCode.expired() && authCode.redirect_uri === req.session.oauth2.redirect_uri) {
                                        var params = {
                                            'code': authCode.value
                                        };
                                        if(req.session.oauth2.state) {
                                            params.state = req.session.oauth2.state;
                                        }
                                        var redirect_uri = util.urlAppendParams(req.session.oauth2.redirect_uri, params);

                                        res.redirect(redirect_uri);
                                    } else {
                                        generateRandomString()
                                            .then(function(authCode) {
                                                (new AuthCode({ application: application, user: req.user, value: authCode, redirect_uri: req.session.oauth2.redirect_uri })).saveWithPromise()
                                                    .then(function() {
                                                        var params = {
                                                            'code': authCode.value
                                                        };
                                                        if(req.session.oauth2.state) {
                                                            params.state = req.session.oauth2.state;
                                                        }

                                                        var redirect_uri = util.urlAppendParams(req.session.oauth2.redirect_uri, params);
                                                        res.redirect(redirect_uri);
                                                    }).fail(function(err) {
                                                        error.redirectError(req, res, new error.ServerError(err.message));
                                                    });
                                            }).fail(function(err) {
                                                error.redirectError(req, res, new error.ServerError(err.message));
                                            });
                                    }

                                }).fail(function(err) {
                                    err.redirectError(req, res, new error.ServerError(err.message))
                                });
                        }).fail(function(err) {
                            err.redirectError(req, res, new error.ServerError(err.message))
                        });
                } else if(!req.body.result) {
                    error.redirectError(req, res, new error.InvalidRequest());
                } else {
                    error.redirectError(req, res, new error.AccessDenied());
                }
            } else {
                error.redirectError(req, res, new error.InvalidRequest());
            }
        });
    });

    var sendAccessTokenResponse = function(access_token, res) {
        res.send({
            access_token: access_token,
            token_type: 'Bearer'
        });
    };

    var generateAccessTokenAndSend = function(authCode, res) {
        generateRandomString()
            .then(function(access_token) {
                (new AccessToken({ application: authCode.application, user: authCode.user, value: access_token })).saveWithPromise()
                    .then(function() {
                        sendAccessTokenResponse(access_token, res);

                        authCode.remove();
                    }).fail(function(err) {
                        error.sendError(res, new error.ServerError(err.message));
                    });
            }).fail(function(err) {
                error.sendError(res, new error.ServerError(err.message));
            });
    };

    app.post('/oauth2/token', express.urlencoded(), function(req, res) {

        if(req.is('application/x-www-form-urlencoded') &&
            req.body &&
            req.body.grant_type === 'authorization_code' &&
            nonEmptyString(req.body.code) &&
            nonEmptyString(req.body.redirect_uri) &&
            nonEmptyString(req.body.client_id) &&
            nonEmptyString(req.body.client_secret)) {



            Application.by({ client_id: req.body.client_id, client_secret: req.body.client_secret })
                .then(function(application) {

                    if(application && application.hasRedirectUri(req.body.redirect_uri)) {

                        AuthCode.by({ application: application, redirect_uri: req.body.redirect_uri, value: req.body.code})
                            .then(function(authCode) {

                                if(authCode && !authCode.expired()) {

                                    AccessToken.byUserAndApplication(authCode.user, application)
                                        .then(function(accessToken) {
                                            if(accessToken) {

                                                sendAccessTokenResponse(accessToken.value, res);
                                                authCode.remove();//TODO should we care about deletion?
                                            } else {
                                                //by idea this should not be possible, but in any case
                                                generateAccessTokenAndSend(authCode, res);
                                            }
                                        })
                                        .fail(function(err) {
                                            error.sendError(res, new error.ServerError(err.message));
                                        });

                                } else {
                                    error.sendError(res, new error.AccessDenied());
                                }

                            }).fail(function(err) {
                                error.sendError(res, new error.ServerError(err.message));
                            });
                    } else {
                        error.sendError(res, new error.AccessDenied());
                    }
                }).fail(function(err) {
                    error.sendError(res, new error.ServerError(err.message));
                });

        } else {
            error.sendError(res, new error.InvalidRequest());
        }

    });

    app.get('/nothing', function(req, res) {
        res.render('nothing');
    })

};