
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
  //So far we do not allow to get all the tags
  //app.get('/tags', tags.index)  
  app.post('/tags', auth.requiresLogin, tags.create)
  app.get('/tags/:path', tags.get)
  app.get('/tags/:path/children', tags.children)
  //app.get('/tags/:id/edit', auth.requiresLogin, auth.tag.hasAuthorization, tags.edit)
  //app.put('/tags/:id', auth.requiresLogin, auth.tag.hasAuthorization, tags.update)
  //app.del('/tags/:id', auth.requiresLogin, auth.tag.hasAuthorization, tags.destroy)
  /*app.param('id', function(req, res, next, id){
    Tag
      .findOne({ _id : id })
      .populate('user', 'label')
      .exec(function (err, tag) {
        if (err) return next(err)
        if (!tag) return next(new Error('Failed to load tag ' + id))
        req.tag = tag
        next()
      })
  })*/
  app.param('path', function(req, res, next, path){
    req.tagPath = path;
    next();
  })

  // home route
  app.get('/', function(req, res){
    if(req.isAuthenticated()){
        //Load inline the root tag
        //TODO: add intelligent loading logic. Such as the whole tree but where order < 50 (50 childs per tag)
        Tag.getAll(req.user, function(tags){
          res.render('main/home', {tags: tags})
        }, function(){
          res.render('500')
        })        
      }      
    else
      res.render('main/index')
  })
}
