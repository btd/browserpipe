var express = require('express'),
    config = require('../config/config'),
    sessionConfig = require('./session-config');

// App settings and middleware
module.exports = function(app) {

  // set views path, template engine and default layout
  app.set('views', __dirname + '/app/views')
  app.set('view engine', 'jade')
  app.set('view options', {'layout': false})

  //Compile less files
  /* TODO replace with connect-assets
  app.use(lessMiddleware({
      dest: __dirname + '/public/css',
      src: __dirname + '/public/less',
      prefix: '/css',
      compress: true
  }));*/

  // dynamic helpers
  app.use(function (req, res, next) {
    res.locals.appName = 'Tagnfile.it';
    res.locals.title = 'Visualize your information';
    
    next();
  })

  // bodyParser should be above methodOverride
  app.use(express.bodyParser());
  app.use(express.methodOverride());

  // cookieParser should be above session
  app.use(express.cookieParser());

  // this will load session if session information is presented
  app.use(sessionConfig.sessionLoad);

  app.use(function(req, res, next) {
     if(req.session && req.session.currentUser) {
         req.currentUser = req.session.currentUser;
     }
     next();
  });

  app.use(express.favicon());

  app.use(express.static(__dirname + '/public'));

  // configure environments
  app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));

    //set up colour logger for dev
    app.use(express.logger('dev'));
  })

    /* Return to this later when we will have something working
  //TODO gzippo should be replaced with nginx reverse proxy
  //app.use('trusted proxy');
  // gzip only in staging and production envs
  app.configure('staging', function(){
    app.use(express.logger(':date :method :url :status'))
    //app.use(gzippo.staticGzip(__dirname + '/public'))
    app.enable('view cache')        
  })

  app.configure('production', function(){
    app.use(express.errorHandler()); 
    app.use(express.logger(':date :method :url :status'))
    //app.use(gzippo.staticGzip(__dirname + '/public'))    
    // view cache is enabled by default in production mode
  }) */

  // routes should be at the last
  app.use(app.router)

   // assume "not found" in the error msgs
  // is a 404. this is somewhat silly, but
  // valid, you can do whatever you like, set
  // properties, use instanceof etc.
  app.use(function(err, req, res, next){
    // treat as 404
    if (~err.message.indexOf('not found')) return next()

    // log it
    console.error(err.stack)

    // error page
    res.status(500).render('500')
  })

  // assume 404 since no middleware responded
  app.use(function(req, res, next){
    res.status(404).render('404', { url: req.originalUrl })
  })


}
