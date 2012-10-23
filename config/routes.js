
var mongoose = require('mongoose')
  , Folder = mongoose.model('Folder')
  , User = mongoose.model('User')
  , async = require('async')

module.exports = function (app, passport, auth) {

  // user routes
  var users = require('../app/controllers/users')
  app.get('/login', users.login)
  app.get('/signup', users.signup)
  app.get('/logout', users.logout)
  app.post('/users', users.create)
  app.post('/users/session', passport.authenticate('local', {failureRedirect: '/login'}), users.session)
  app.get('/users/:userId', users.show)
  app.get('/auth/facebook', passport.authenticate('facebook', { scope: [ 'email', 'user_about_me'], failureRedirect: '/login' }), users.signin)
  app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), users.authCallback)
  app.get('/auth/github', passport.authenticate('github', { failureRedirect: '/login' }), users.signin)
  app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), users.authCallback)
  app.get('/auth/twitter', passport.authenticate('twitter', { failureRedirect: '/login' }), users.signin)
  app.get('/auth/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/login' }), users.authCallback)
  app.get('/auth/google', passport.authenticate('google', { failureRedirect: '/login', scope: 'https://www.google.com/m8/feeds' }), users.signin)
  app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login', scope: 'https://www.google.com/m8/feeds' }), users.authCallback)

  app.param('userId', function (req, res, next, id) {
    User
      .findOne({ _id : id })
      .exec(function (err, user) {
        if (err) return next(err)
        if (!user) return next(new Error('Failed to load User ' + id))
        req.profile = user
        next()
      })
  })

  // folder routes
  var folders = require('../app/controllers/folders')
  app.get('/folders', folders.index)
  app.get('/folders/new', auth.requiresLogin, folders.new)
  app.post('/folders', auth.requiresLogin, folders.create)
  app.get('/folders/:id', folders.show)
  app.get('/folders/:id/edit', auth.requiresLogin, auth.folder.hasAuthorization, folders.edit)
  app.put('/folders/:id', auth.requiresLogin, auth.folder.hasAuthorization, folders.update)
  app.del('/folders/:id', auth.requiresLogin, auth.folder.hasAuthorization, folders.destroy)

  app.param('id', function(req, res, next, id){
    Folder
      .findOne({ _id : id })
      .populate('user', 'label')
      .exec(function (err, folder) {
        if (err) return next(err)
        if (!folder) return next(new Error('Failed to load folder ' + id))
        req.folder = folder
        next()
      })
  })

  // home route
  app.get('/', function(req, res){
    if(req.isAuthenticated())    
      res.render('index/home')
    else
      res.render('index/index')
  })
}
