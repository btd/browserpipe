var auth = require('./middlewares/authorization');

module.exports = function (app, passport) {

  //General routes
  var main = require('./controllers/main');
  app.get('/', main.home);  
  
  //User routes
  var users = require('./controllers/user')  ;
  app.get('/login', users.login);  
  app.get('/logout', users.logout);
  app.post('/users', users.create);
  app.post('/users/session', passport.authenticate('local', { successReturnToOrRedirect: '/', failureRedirect: '/login', badRequestMessage: "Please enter valid email and password", failureFlash: true }));

  app.param('userId', users.user);

  //Home routes
  app.get(    '/panel1/:type1/:id1',                     auth.ensureLoggedIn('/login'), main.home);
  app.get(    '/panel1/:type1/:id1/panel2/:type2/:id2',  auth.ensureLoggedIn('/login'), main.home);

  //Invitation routes
  var invitation = require('./controllers/invitation');
  app.get('/invitation/signup/:invitationId', invitation.accepted, users.signup);
  app.post(  '/invitations', invitation.create);

  app.param('invitationId', invitation.invitation);

  //Extension
  app.get(    '/clients/chrome/extension.crx', auth.send401IfNotAuthenticated, main.chromeExtension);

  //Listboards routes
  var listboard = require('./controllers/listboard');
  app.post(  '/listboards',                auth.send401IfNotAuthenticated, listboard.create);
  app.put(   '/listboards/:listboardId',   auth.send401IfNotAuthenticated, listboard.update);
  app.delete('/listboards/:listboardId',   auth.send401IfNotAuthenticated, listboard.destroy);

  app.param('listboardId', auth.send401IfNotAuthenticated, listboard.listboard);    

  //Containers routes
  var container = require('./controllers/container');
  app.post(   '/listboards/:listboardId/containers',               auth.send401IfNotAuthenticated, container.create);
  app.put(    '/listboards/:listboardId/containers/:containerId',  auth.send401IfNotAuthenticated, container.update);
  app.delete( '/listboards/:listboardId/containers/:containerId',  auth.send401IfNotAuthenticated, container.destroy);

  //Folders routes
  var folder = require('./controllers/folder');
  app.post(   '/folders',             auth.send401IfNotAuthenticated, folder.create);
  app.put(    '/folders/:folderId',     auth.send401IfNotAuthenticated, folder.update);
  app.delete( '/folders/:folderId',    auth.send401IfNotAuthenticated, folder.destroy);
    
  app.param('folderId', auth.send401IfNotAuthenticated, folder.folder);

  //Items routes
  var item = require('./controllers/item');
  app.post(   '/listboards/:listboardId/containers/:containerId/items',  auth.send401IfNotAuthenticated, item.create);
  app.post(   '/folders/:folderId/items',  auth.send401IfNotAuthenticated, item.create);
  app.put(    '/items/:itemId',  auth.send401IfNotAuthenticated, item.update);
  app.delete( '/listboards/:listboardId/containers/:containerId/items/:itemId',  auth.send401IfNotAuthenticated, item.remove);
  app.delete( '/folders/:folderId/items/:itemId',  auth.send401IfNotAuthenticated, item.remove);
    
  app.param('itemId', auth.send401IfNotAuthenticated, item.item);

    
  
};
