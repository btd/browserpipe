var express = require('express'),
  RedisStore = require('connect-redis')(express);

var logger = require('rufus').getLogger('express');
var config = require('../config');

var manifest = require('../manifest');

// App settings and middleware
module.exports = function(app, passport) {

  //app.use(express.static(__dirname + '/../public'));
  app.use('/public/storage', express.static(__dirname + '/../public/storage'));
  app.use('/public', express.static(__dirname + '/../dist'));

  //We update the limits of the size we accept
  app.use(express.json({limit: '30mb'}));
  app.use(express.urlencoded({limit: '30mb'}));

  // set views path, template engine and default layout
  app.set('views', __dirname + '/views')
  app.set('view engine', 'jade')
  app.set('view options', {'layout': false});

  // dynamic helpers
  app.use(function(req, res, next) {
    res.locals.appName = 'Browserpipe';
    res.locals.title = 'Your browser everywhere';

    res.locals.asset_url = manifest('./dist/manifest.json', '/public').url;//TODO improve this thing

    next();
  });

  // parameters validator
  var expressValidator = require('express-validator');
  app.use(expressValidator());

  // cookieParser should be above session
  app.use(express.cookieParser());

  // save session in mongodb collection sessions
  app.use(express.session({
    secret: config.cookieSecret,
    store: new RedisStore(config.redis)
  }));

  // use passport session
  app.use(passport.initialize());
  app.use(passport.session());

  // flash messages
  app.use(require('connect-flash')());

  //app.use(express.favicon());



  app.use(express.logger({ format: 'short', stream: {
    write: function(msg) {
      logger.info(msg.substr(0, msg.length - 1));
    }
  }}));

  // All next thing to make socket.io + express + passport friends
  // Create http server
  var http = require('http');
  var server = http.createServer(app);

  // Configure socket.io
  var sio = require('./socket.io');

  //Initialize socket io
  sio.init(server);

  //Add socket.io middleware
  //app.use(sio.socketMiddleware());

  // routes should be at the last
  app.use(app.router)

  // common error handler
  app.use(function(err, req, res, next) {
    // log it
    logger.error('Exception in express', err);

    res.format({
      html: function() {
        res.status(500).render('500');
      },

      json: function() {
        res.json(500, {code: 500, error: "Oop's something went wrong"});
      }
    });

    next();
  });

  // assume 404 since no middleware responded
  app.use(function(req, res) {
    res.format({

      html: function() {
        res.status(404).render('404', { url: req.originalUrl })
      },

      json: function() {
        res.json(404, { code: 404, error: "Not found"});
      }
    });

  });

  return server;

}
