var session = require('express-session');

var RedisStore = require('connect-redis')(session);

var logger = require('rufus').getLogger('express');
var config = require('../config');

var serveStatic = require('serve-static');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var morgan  = require('morgan');

var expressValidator = require('express-validator');

var manifest = require('../manifest');

var newrelic = require('newrelic');

// App settings and middleware
module.exports = function(app, passport) {


  app.use('/public/storage', serveStatic(__dirname + '/../public/storage'));
  app.use('/public', serveStatic(__dirname + '/../dist'));

  //We update the limits of the size we accept
  app.use(bodyParser.json({ limit: '30mb' }));
  app.use(bodyParser.urlencoded({extended: true, limit: '30mb' }));

  // set views path, template engine and default layout
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('view options', {'layout': false});

  // dynamic helpers - but they can be not a dynamic
  app.use(function(req, res, next) {
    res.locals.appName = 'Browserpipe';
    res.locals.title = 'Your browser everywhere';
    res.locals.newrelic = newrelic;

    res.locals.asset_url = manifest('./dist/manifest.json', '/public').url;//TODO improve this thing

    next();
  });

  // parameters validator

  app.use(expressValidator());

  // cookieParser should be above session
  app.use(cookieParser());

  // save session in mongodb collection sessions
  app.use(session({
    name: config.session.cookie.name,
    secret: config.session.cookie.secret,
    store: new RedisStore(config.redis),
    resave: true,
    saveUninitialized: true
  }));

  // use passport session
  app.use(passport.initialize());
  app.use(passport.session());

  // flash messages
  app.use(require('connect-flash')());

  app.use(morgan('short', { stream: {
    write: function(msg) {
      logger.info(msg.substr(0, msg.length - 1));
    }
  }}));

  // All next thing to make socket.io + express + passport friends
  // Create http server
  var http = require('http');
  var server = http.createServer(app);

  // Configure socket.io
  require('./socket.io')(server);
  // Bootstrap routes
  require('./routes')(app, passport);

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
