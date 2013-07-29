var auth = require('./middlewares/authorization');
var env = require('./config').env;

var isProd = env === 'production';
if(isProd) {
    module.exports = function(app) {
        var main = require('../app/controllers/main')
        app.get('/', main.home);

        var invitation = require('../app/controllers/invitation')
        app.post(  '/invitations', invitation.create)
    }
} else {

module.exports = function (app, passport) {

  //General routes
  var main = require('../app/controllers/main');
  app.get('/', main.home);
  app.get('/about', main.about);

  //User routes
  var users = require('../app/controllers/user')  ;
  app.get('/login', users.login);
  app.get('/signup', users.signup);
  app.get('/logout', users.logout);

  app.post('/users', users.create);
  app.post('/users/session', passport.authenticate('local', { successReturnToOrRedirect: '/', failureRedirect: '/login' }));
    
  app.param('userId', users.user);

  //Invitation routes
  var invitation = require('../app/controllers/invitation');
  app.post(  '/invitations', invitation.create);

  //Listboard routes
  var listboard = require('../app/controllers/listboard');
  app.get(   '/listboards',                auth.ensureLoggedIn('/login'), listboard.showEmpty);
  app.get(   '/listboards/:listboardId',   auth.ensureLoggedIn('/login'), listboard.show);
  app.post(  '/listboards',                auth.send401IfNotAuthenticated, listboard.create);
  app.put(   '/listboards/:listboardId',   auth.send401IfNotAuthenticated, listboard.update);
  app.delete('/listboards/:listboardId',   auth.send401IfNotAuthenticated, listboard.destroy);
    
  app.param('listboardId', auth.send401IfNotAuthenticated, listboard.listboard);

  //Containers routes
  var container = require('../app/controllers/container');
  app.post(   '/listboards/:listboardId/containers',               auth.send401IfNotAuthenticated, container.create);
  app.put(    '/listboards/:listboardId/containers/:containerId',  auth.send401IfNotAuthenticated, container.update);
  app.delete( '/listboards/:listboardId/containers/:containerId',  auth.send401IfNotAuthenticated, container.destroy);

  //Lists routes
  var list = require('../app/controllers/list');
  app.post( '/lists',             auth.send401IfNotAuthenticated, list.create);
  app.put(  '/lists/:listId',     auth.send401IfNotAuthenticated, list.update);
  app.delete('/lists/:listId',    auth.send401IfNotAuthenticated, list.destroy);
    
  app.param('listId', auth.send401IfNotAuthenticated, list.list);

  //Items routes
  var item = require('../app/controllers/item');
  app.post(   '/items',          item.create);
  app.put(    '/items/:itemId',  item.update);
  app.delete( '/items/:itemId',  item.destroy);
    
  app.param('itemId', item.item);
  
};
}
