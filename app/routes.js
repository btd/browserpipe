var auth = require('./middlewares/authorization'),
  cors = require('./middlewares/cors');

var main = require('./controllers/main');

module.exports = function (app, passport) {

  //General routes
  app.get('/', main.home);
  app.get('/faq', main.faq);
  app.get('/help', main.help);
  app.get('/about', main.about);
  app.get('/privacy', main.privacy);
  app.get('/terms', main.terms);

  //User routes
  var users = require('./controllers/user');
  app.get('/login', users.login);
  app.get('/logout', users.logout);
  app.post('/users', users.create);
  app.post('/authenticate', passport.authenticate('local', {
    successReturnToOrRedirect: '/',
    failureRedirect: '/login',
    badRequestMessage: "Please enter valid email and password",
    failureFlash: true
  }));

  //Home routes
  app.get('/item/:id1', auth.ensureLoggedIn('/login'), main.home);

  //Invitation routes
  var invitation = require('./controllers/invitation');
  app.get('/invitation/signup/:invitationId', invitation.accepted, users.signup);
  app.post('/invitations', invitation.create);

  app.param('invitationId', invitation.invitation);

  //Items routes
  var item = require('./controllers/item');

  app.param('itemId', item.item);

  app.route('/items/:itemId')
    .all(auth.send401IfNotAuthenticated)
    .put(item.update)
    .delete(item.delete);

  app.route('/items')
    .all(auth.send401IfNotAuthenticated)
    .post(item.addItem)
    .get(item.get);


  //Search routes
  app.get('/search/:query', auth.send401IfNotAuthenticated, item.search);

  app.param('query', item.query);

  //Bookmarlet routes
  var bookmarklets = require('./controllers/bookmarklet');
  app.get('/add', auth.ensureLoggedIn('/login'), bookmarklets.addUrl);
  app.post('/add', auth.send401IfNotAuthenticated, cors.allowAllAccess, bookmarklets.addPage);
};


