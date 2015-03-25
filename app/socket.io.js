var _ = require('lodash');

var session = require('express-session');

var RedisStore = require('connect-redis')(session);
var cookieParser = require('cookie-parser');

var config = require('../config');

var userUpdate = require('./controllers/user_update');

passportSocketIo = require("passport.socketio");

module.exports = function(server) {
  var io = require('socket.io')(server);

  io.use(passportSocketIo.authorize({
    cookieParser: cookieParser,
    key: config.session.cookie.name,
    secret: config.session.cookie.secret,
    store: new RedisStore(config.redis)
  }));

  io.on("connection", function(socket) {
    var user = socket.request.user;
    if(user) {
      var client = userUpdate.waitUserUpdates(user._id, function(event, data) {
        socket.emit(event, data);
      });

      socket.on('disconnect', function() {
        client.end();
      });
    }
  });
};
