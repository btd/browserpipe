
var mongoose = require('mongoose')
  , Tag = mongoose.model('Tag')
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

  // tag routes
  var tags = require('../app/controllers/tags')
  app.get('/tags', tags.index)
  app.get('/tags/new', auth.requiresLogin, tags.new)
  app.post('/tags', auth.requiresLogin, tags.create)
  app.get('/tags/:id', tags.show)
  app.get('/tags/:id/edit', auth.requiresLogin, auth.tag.hasAuthorization, tags.edit)
  app.put('/tags/:id', auth.requiresLogin, auth.tag.hasAuthorization, tags.update)
  app.del('/tags/:id', auth.requiresLogin, auth.tag.hasAuthorization, tags.destroy)

  app.param('id', function(req, res, next, id){
    Tag
      .findOne({ _id : id })
      .populate('user', 'label')
      .exec(function (err, tag) {
        if (err) return next(err)
        if (!tag) return next(new Error('Failed to load tag ' + id))
        req.tag = tag
        next()
      })
  })

  // home route
  app.get('/', function(req, res){
    if(req.isAuthenticated())    
      res.render('main/home')
    else
      res.render('main/index')
  })
}
