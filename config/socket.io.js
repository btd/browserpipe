var _ = require('lodash'),
    express = require('express'),
    mongoStore = require('connect-mongo')(express),
    config = require('./config'),
    io = require('socket.io');

var userUpdate = require('../app/controllers/user_update');

module.exports = function () {

    var parseCookie = function (auth, cookieHeader) {
        var cookieParser = auth.cookieParser(auth.secret);
        var req = {
            headers: {
                cookie: cookieHeader
            }
        };
        var result;
        cookieParser(req, {}, function (err) {
            if (err) throw err;
            result = req.signedCookies;
        });
        return result;
    }

    var authorize = function (options) {
        var defaults = {
            passport: require('passport'),
            key: 'connect.sid',
            secret: null,
            store: null,
            success: null,
            fail: null
        };

        var auth = _.extend({}, defaults, options);

        auth.userProperty = auth.passport._userProperty || 'user';

        if (typeof auth.cookieParser === 'undefined' || !auth.cookieParser) {
            throw new Error('cookieParser is required use connect.cookieParser or express.cookieParser');
        }

        return function (data, accept) {
            if (!data.headers.cookie) {
                return accept(null, false);
            }

            data.cookie = parseCookie(auth, data.headers.cookie);

            data.sessionID = data.cookie[auth.key];

            auth.store.get(data.sessionID, function (err, session) {
                if (err) {
                    return accept('Error in session store.', false);
                } else if (!session) {
                    return accept(null, false);
                }

                if (!session[auth.passport._key]) {
                    return accept('passport was not initialized', false);
                }

                var userKey = session[auth.passport._key][auth.userProperty];

                if (userKey === undefined) {
                    if (auth.fail)
                        return auth.fail(data, accept);
                    else
                        return accept(null, false);
                }

                auth.passport.deserializeUser(userKey, function (err, user) {
                    data[auth.userProperty] = user;
                    if (auth.success) {
                        return auth.success(data, accept);
                    }
                    accept(null, true);
                });

            });
        };
    };

    var filterSocketsByUser = function (sio, filter) {
        var handshaken = sio.sockets.manager.handshaken;
        return Object.keys(handshaken || {})
            .filter(function (skey) {
                return filter(handshaken[skey].user);
            })
            .map(function (skey) {
                return sio.sockets.manager.sockets.sockets[skey];
            });
    };

    return {

        init: function (server) {
            this.sio = io.listen(server, config['socket-io']);

            this.sio.set("authorization", authorize({
                cookieParser: express.cookieParser, //or connect.cookieParser
                secret: 'd5bSD5N0dl3Vs1SwXw6pMkxS', //the session secret to parse the cookie
                store: new mongoStore(config["connect-mongo"]), //the session store that express uses
                fail: function (data, accept) { // *optional* callbacks on success or fail
                    accept(null, false); // second param takes boolean on whether or not to allow handshake
                },
                success: function (data, accept) {
                    accept(null, true);
                }
            }));


            this.sio.sockets.on("connection", function (socket) {
                //console.log("user connected: ", socket.handshake.user.name);
                var client = userUpdate.waitUserUpdates(socket.handshake.user._id, function(event, data) {
                    socket.emit(event, data);
                });

                socket.on('disconnect', function(){
                    client.end();
                });
            });
        },
        socketMiddleware: function () {
            var self = this;
            return function (req, res, next) {
                if (req.isAuthenticated()) {
                    var id = req.user._id.toString();
                    req.sockets = filterSocketsByUser(self.sio, function (user) {
                        return user._id.toString() === id;
                    });
                }
                next();
            }
        }
    }
}();