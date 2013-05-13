
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
  
}
