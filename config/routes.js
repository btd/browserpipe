
module.exports = function (app, passport, auth) {

  //User routes
  var users = require('../app/controllers/user')
  app.get('/', users.init)
  app.get('/login', users.login)
  app.get('/signup', users.signup)
  app.get('/logout', users.logout)
  app.post('/users', users.create)
  app.post('/users/session', passport.authenticate('local', {failureRedirect: '/login'}), users.session)
    
  app.param('userId', users.user)

  //Dashboard routes
  var dashboard = require('../app/controllers/dashboard')
  app.get('/dashboards', dashboard.showEmpty)
  app.get('/dashboards/:dashboardId', dashboard.show)
  app.post('/dashboards', dashboard.create)
  app.put('/dashboards/:dashboardId', dashboard.update)  
    
  app.param('dashboardId', dashboard.dashboard)

  //Tags routes
  var tag = require('../app/controllers/tag')
  app.post('/tags', tag.create)
  app.put('/tags/:tagId', tag.update)  
    
  app.param('tagId', tag.tag)

  //Containers routes
  var container = require('../app/controllers/container')
  app.post('/containers', container.create)
  app.put('/containers/:containerId', container.update)  
  app.delete('/containers/:containerId', container.destroy)  
    
  app.param('containerId', container.container)

  //Items routes
  var item = require('../app/controllers/item')
  app.post('/items', item.create)
  app.put('/items/:itemId', item.update)  
  app.delete('/items/:itemId', item.destroy)  
    
  app.param('itemId', item.item)

/*

  //Tag routes
  var tags = require('../app/controllers/tags')
  //So far we do not allow to get all the tags
  //app.get('/tags', tags.index)  
  app.post('/tags', auth.requiresLogin, tags.create)
  app.get('/tags/:path', tags.get)
  app.get('/tags/:path/children', tags.children)
  //app.get('/tags/:id/edit', auth.requiresLogin, auth.tag.hasAuthorization, tags.edit)
  //app.put('/tags/:id', auth.requiresLogin, auth.tag.hasAuthorization, tags.update)
  //app.del('/tags/:id', auth.requiresLogin, auth.tag.hasAuthorization, tags.destroy)
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
  app.param('path', function(req, res, next, path){
    req.tagPath = path;
    next();
  })*/

  
}
