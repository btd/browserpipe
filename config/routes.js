var auth = require('./middlewares/authorization');


module.exports = function (app, passport) {

  //User routes
  var users = require('../app/controllers/user')
  app.get('/', users.init)
  app.get('/login', users.login)
  app.get('/signup', users.signup)
  app.get('/logout', users.logout)

  app.post('/users', users.create)
  app.post('/users/session', passport.authenticate('local', {failureRedirect: '/login'}), auth.redirectFrom('/', '/login'));
    
  app.param('userId', users.user)

  //Dashboard routes
  var dashboard = require('../app/controllers/dashboard')
  app.get(  '/dashboards',                auth.redirectIfNotAuthenticated('/'), dashboard.showEmpty)
  app.get(  '/dashboards/:dashboardId',   auth.redirectIfNotAuthenticated('/'), dashboard.show)
  app.post( '/dashboards',                auth.send401IfNotAuthenticated, dashboard.create)
  app.put(  '/dashboards/:dashboardId',   auth.send401IfNotAuthenticated, dashboard.update)  
    
  app.param('dashboardId', dashboard.dashboard)

  //Containers routes
  var container = require('../app/controllers/container')
  app.post(   '/dashboards/:dashboardId/containers',               auth.send401IfNotAuthenticated, container.create)
  app.put(    '/dashboards/:dashboardId/containers/:containerId',  auth.send401IfNotAuthenticated, container.update)  
  app.delete( '/dashboards/:dashboardId/containers/:containerId',  auth.send401IfNotAuthenticated, container.destroy)  

  //Tags routes
  var tag = require('../app/controllers/tag')
  app.post('/tags', tag.create)
  app.put('/tags/:tagId', tag.update)  
    
  app.param('tagId', tag.tag)

  //Items routes
  var item = require('../app/controllers/item')
  app.post('/items', item.create)
  app.put('/items/:itemId', item.update)  
  app.delete('/items/:itemId', item.destroy)  
    
  app.param('itemId', item.item)
  
}
