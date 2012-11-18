var config = require('../config/config')
  , LocalStrategy = require('passport-local').Strategy
  , User = require('./models/user');


module.exports = function (passport) {
  

  console.log("Initializing database");
  require('mongoose').connect(config.db.uri)

  // serialize sessions
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });

  // use local strategy
  passport.use(new LocalStrategy({
      usernameField: 'email'
    },
    function(email, password, done) {
      User.authenticate(email, password, function(err, user) {
        return done(err, user);
      });
    }
  ))
}