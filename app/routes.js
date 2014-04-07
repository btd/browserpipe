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

  app.post(  '/items/:itemId/items', auth.send401IfNotAuthenticated, item.addToItem);
  app.put(   '/items/:itemId',       auth.send401IfNotAuthenticated, item.update);
  app.delete('/items/:itemId',       auth.send401IfNotAuthenticated, item.delete);

  app.param('itemId', auth.send401IfNotAuthenticated, item.item);

  //Search routes
  app.get(    '/search/:query',  auth.send401IfNotAuthenticated, item.search);

  app.param('query', auth.send401IfNotAuthenticated, item.query);

  //HTML for item
  var browser = require('./browser/main');
  app.get('/html-item/:itemId', auth.send401IfNotAuthenticated, browser.htmlItem);

  //Bookmarlet routes
  var bookmarklet = require('./controllers/bookmarklet');
  app.get('/bookmarklet/login', bookmarklet.login);
  app.post('/bookmarklet/session', passport.authenticate('local', { successReturnToOrRedirect: '/bookmarklet/add', failureRedirect: '/bookmarklet/login', badRequestMessage: "Please enter valid email and password", failureFlash: true }));
  app.get('/bookmarklet/start', auth.ensureLoggedIn('/bookmarklet/login'), bookmarklet.start);
  app.post('/bookmarklet/add', auth.send401IfNotAuthenticated, browser.htmlBookmarklet);

};


