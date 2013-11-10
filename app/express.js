var express = require('express'),
    mongoStore = require('connect-mongo')(express),
    config = require('./../config');

var logger = require('rufus').getLogger('express');

// App settings and middleware
module.exports = function (app, config, passport) {

    // set views path, template engine and default layout
    app.set('views', __dirname + '/views')
    app.set('view engine', 'jade')
    app.set('view options', {'layout': false});

    var cm = new (require('./connect-mincer'))(config.mincer);
    require('./middlewares/less-mincer')(cm.environment);
    cm.preprocess();
    app.use(cm.middleware());
    app.use(config.mincer.url, cm.createServer());

    // dynamic helpers
    app.use(function (req, res, next) {
        res.locals.appName = 'Listboard.it';
        res.locals.title = 'Visualize your information';

        next();
    })

    // bodyParser should be above methodOverride
    //app.use(express.bodyParser()); replace it with explicit formats
    app.use(express.urlencoded());
    app.use(express.json());
    // so it is as it was but without multipart (for file uploads)
    //app.use(express.methodOverride()); we do not use it now

    // parameters validator
    var expressValidator = require('express-validator');
    app.use(expressValidator());

    // cookieParser should be above session
    app.use(express.cookieParser());

    // save session in mongodb collection sessions
    app.use(express.session({
        secret: config.cookieSecret,
        store: new mongoStore(config["connect-mongo"])
    }))

    // use passport session
    app.use(passport.initialize());
    app.use(passport.session());

    // flash messages
    app.use(require('connect-flash')());

    app.use(express.favicon());

    app.use(express.static(__dirname + '/../public')); //TODO we need this only for local development

    app.use(express.logger({ format: 'short', stream: {
        write: function(msg) {
            logger.info(msg.substr(0, msg.length - 1));
        }
    }}));

    // All next thing to make socket.io + express + passport friends
    // Create http server
    var http = require('http')
    var server = http.createServer(app)

    // Configure socket.io
    var sio = require('./socket.io');

    //Initialize socket io
    sio.init(server);
    
    //Add socket.io middleware
    app.use(sio.socketMiddleware());

    // routes should be at the last
    app.use(app.router)

    // common error handler
    app.use(function (err, req, res, next) {
        // log it
        logger.error('Exception in express', err);

        res.format({
            html: function () {
                res.status(500).render('500');
            },

            json: function () {
                res.json(500, {code: 500, error: "Oop's something went wrong"});
            }
        });
        // error page

    })

    // assume 404 since no middleware responded
    app.use(function (req, res, next) {
        res.format({

            html: function () {
                res.status(404).render('404', { url: req.originalUrl })
            },

            json: function () {
                res.json(404, { code: 404, error: "Not found"});
            }
        });

    })

    return server;

}