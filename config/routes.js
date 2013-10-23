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
  
  //User routes
  var users = require('../app/controllers/user')  ;
  app.get('/login', users.login);
  app.get('/signup', users.signup);
  app.get('/logout', users.logout);
  app.post('/users', users.create);
  app.post('/users/session', passport.authenticate('local', { successReturnToOrRedirect: '/', failureRedirect: '/login', badRequestMessage: "Please enter valid email and password", failureFlash: true }));
    
  app.param('userId', users.user);

  //Invitation routes
  var invitation = require('../app/controllers/invitation');
  app.post(  '/invitations', invitation.create);

  //Extension
  app.get(    '/clients/chrome/extension.crx', auth.send401IfNotAuthenticated, main.chromeExtension);

  //Listboard
  var listboard = require('../app/controllers/listboard');
  app.get(    '/listboards',              auth.ensureLoggedIn('/login'), main.home);
  app.get(    '/listboard/:listboardId',  auth.ensureLoggedIn('/login'), main.home);
  app.get(    '/listboard/:listboardId/settings',      auth.ensureLoggedIn('/login'), main.home);

  //Listboards routes
  app.post(  '/listboards',                auth.send401IfNotAuthenticated, listboard.create);
  app.put(   '/listboards/:listboardId',   auth.send401IfNotAuthenticated, listboard.update);
  app.delete('/listboards/:listboardId',   auth.send401IfNotAuthenticated, listboard.destroy);

  app.param('listboardId', auth.send401IfNotAuthenticated, listboard.listboard);    

  //Containers routes
  var container = require('../app/controllers/container');
  app.post(   '/listboards/:listboardId/containers',               auth.send401IfNotAuthenticated, container.create);
  app.put(    '/listboards/:listboardId/containers/:containerId',  auth.send401IfNotAuthenticated, container.update);
  app.delete( '/listboards/:listboardId/containers/:containerId',  auth.send401IfNotAuthenticated, container.destroy);

  //Folders routes
  var folder = require('../app/controllers/folder');
  app.post(   '/folders',             auth.send401IfNotAuthenticated, folder.create);
  app.put(    '/folders/:folderId',     auth.send401IfNotAuthenticated, folder.update);
  app.delete( '/folders/:folderId',    auth.send401IfNotAuthenticated, folder.destroy);
    
  app.param('folderId', auth.send401IfNotAuthenticated, folder.folder);

  //Items routes
  var item = require('../app/controllers/item');
  app.get(    '/item/:itemId',  auth.ensureLoggedIn('/login'), main.home);
  
  app.post(   '/items',          item.create);
  app.put(    '/items/:itemId',  item.update);
  app.delete( '/items/:itemId',  item.destroy);
    
  app.param('itemId', item.item);

    
  
};
}
