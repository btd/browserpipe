var auth = require('./middlewares/authorization'),
    cors = require('./middlewares/cors');

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
  app.get('/item/:id1', auth.ensureLoggedIn('/login'), main.home);

  //Modal routes
  var modal = require('./controllers/modal');
  app.get('/modal/bookmarklet', auth.send401IfNotAuthenticated, modal.bookmarklet);

  //Invitation routes
  var invitation = require('./controllers/invitation');
  app.get('/invitation/signup/:invitationId', invitation.accepted, users.signup);
  app.post(  '/invitations', invitation.create);

  app.param('invitationId', invitation.invitation);

  //Items routes
  var item = require('./controllers/item');

  //add
  app.post(  '/items/:itemId', auth.send401IfNotAuthenticated, item.addItem);
  //move
  app.put(   '/items/:itemId/move', auth.send401IfNotAuthenticated, item.moveItem);
  //update
  app.put(   '/items/:itemId', auth.send401IfNotAuthenticated, item.update);
  //delete
  app.delete('/items/:itemId', auth.send401IfNotAuthenticated, item.delete);

  app.param('itemId', auth.send401IfNotAuthenticated, item.item);

  //Search routes
  app.get(    '/search/:query',  auth.send401IfNotAuthenticated, item.search);

  app.param('query', auth.send401IfNotAuthenticated, item.query);

  //HTML for item
  var browser = require('./browser/main');
  app.get('/html-item/:itemId', auth.send401IfNotAuthenticated, browser.htmlItem);

  //Bookmarlet routes
  app.post('/bookmarklet/add', cors.allowAllAccess, auth.send401IfNotAuthenticated, browser.htmlBookmarklet);
  app.get('/bookmarklet/archive', auth.ensureLoggedIn('/login'), main.bookmarkletArchive);
  app.get('/bookmarklet/open', auth.ensureLoggedIn('/login'), main.bookmarkletOpen);

};


