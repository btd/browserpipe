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
  app.get(    '/item/:id1',                     auth.ensureLoggedIn('/login'), main.home);

  //Invitation routes
  var invitation = require('./controllers/invitation');
  app.get('/invitation/signup/:invitationId', invitation.accepted, users.signup);
  app.post(  '/invitations', invitation.create);

  app.param('invitationId', invitation.invitation);

  //Extension
  app.get(    '/clients/chrome/extension.crx', auth.send401IfNotAuthenticated, main.chromeExtension);

  //Bookmark
  app.get('//:url(*)', function(req, res) {
    console.log('yesss ')
    res.send('thx');
  })

  app.param('url', function(req, res, next, id) {
    console.log(id);
    next();
  });

  //Listboards routes
  var listboard = require('./controllers/listboard');
  app.param('listboardId', auth.send401IfNotAuthenticated, listboard.listboard);

    //@Deprecated: there is only one listboard of type 1 (later) and listboars of type 0 are created from extensions installation
  //app.post(  '/listboards',                auth.send401IfNotAuthenticated, listboard.create);
  //app.put(   '/listboards/:listboardId',   auth.send401IfNotAuthenticated, listboard.update);
  //app.delete('/listboards/:listboardId',   auth.send401IfNotAuthenticated, listboard.destroy);

  //Containers routes
  var item = require('./controllers/item');
  //var container = require('./controllers/container');
  //app.post(   '/listboards/:listboardId/containers',                   auth.send401IfNotAuthenticated, item.addToListboard);
  //app.put(    '/listboards/:listboardId/containers/:containerId',    auth.send401IfNotAuthenticated, item.update);
  //app.put(    '/listboards/:listboardId/containers/:itemId/items',   auth.send401IfNotAuthenticated, item.copymoveitems);
  //app.post(   '/listboards/:listboardId/containers/:itemId/items',   auth.send401IfNotAuthenticated, item.add);
  //app.delete( '/listboards/:listboardId/containers/:itemId',         auth.send401IfNotAuthenticated, item.destroy);

  app.post(  '/items/:itemId/items', auth.send401IfNotAuthenticated, item.addToItem);
  app.put(   '/items/:itemId',       auth.send401IfNotAuthenticated, item.update);
  app.delete('/items/:itemId',       auth.send401IfNotAuthenticated, item.delete);

  app.get('/add', auth.ensureLoggedIn('/login'), item.addItemBookmarklet);

  app.param('itemId', auth.send401IfNotAuthenticated, item.item);

  app.get('/storage-item/:storageId', auth.send401IfNotAuthenticated, item.storageItem);

  //Search route  
  app.get(    '/search/:query',  auth.send401IfNotAuthenticated, item.search);    

  app.param('query', auth.send401IfNotAuthenticated, item.query);

  var browser = require('./browser/main');
  app.get('/html-item/:itemId', auth.send401IfNotAuthenticated, browser.htmlItem);
};


