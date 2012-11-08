
/**
 * Module dependencies.
 */

var express = require('express')
  , lessMiddleware = require('less-middleware')
  , gzippo = require('gzippo')
  , mongoStore = require('connect-mongodb')
  , requirejs = require('requirejs')

// App settings and middleware
exports.boot = function(app, config, passport) {

  // set views path, template engine and default layout
  app.set('views', __dirname + '/app/views')
  app.set('view engine', 'jade')
  app.set('view options', {'layout': false})

  //Compile less files
  app.use(lessMiddleware({
      dest: __dirname + '/public/css',
      src: __dirname + '/public/less',
      prefix: '/css',
      compress: true
  }));

  // dynamic helpers
  app.use(function (req, res, next) {
    res.locals.appName = 'Tagnfile.it'
    res.locals.title = 'Organize your bookmarks'
    res.locals.showStack = app.showStackError
    res.locals.req = req
    res.locals.formatDate = function (date) {
      var monthNames = [ "Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec" ]
      return monthNames[date.getMonth()]+' '+date.getDate()+', '+date.getFullYear()
    }
    res.locals.stripScript = function (str) {
      return str.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    }
    next()
  })

  // bodyParser should be above methodOverride
  app.use(express.bodyParser())
  app.use(express.methodOverride())

  // cookieParser should be above session
  app.use(express.cookieParser())

  // save session in mongodb collection sessions
  app.use(express.session({
    secret: 'd5bSD5N0dl3Vs1SwXw6pMkxS',
    store: new mongoStore({
      url: config.db.uri,
      collection : 'sessions'
    })
  }))

  app.use(passport.initialize())
  app.use(passport.session())

  app.use(express.favicon())

   // show error on screen. False for all envs except development
  // settmgs for custom error handlers
  app.set('showStackError', false)

  // configure environments
  app.configure('development', function(){
    //set up colour logger for dev
    app.use(express.logger('dev'))
    app.set('showStackError', true)
    app.use(express.static(__dirname + '/public'))   
    requirejs.optimize(config.requirejs, function(){
      console.log('Requirejs - Successfully optimized javascript')
    })
  })

  // gzip only in staging and production envs
  app.configure('staging', function(){
    app.use(express.logger(':date :method :url :status'))
    app.use(gzippo.staticGzip(__dirname + '/public'))
    app.enable('view cache')        
  })

  app.configure('production', function(){
    app.use(express.logger(':date :method :url :status'))
    app.use(gzippo.staticGzip(__dirname + '/public'))    
    // view cache is enabled by default in production mode
  }) 

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
