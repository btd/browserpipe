var mongoose = require('mongoose'),
    LocalStrategy = require('passport-local').Strategy,
    User = mongoose.model('User');

var error = { message: 'Invalid email or password' };

module.exports = function (passport) {

    // serialize sessions
    passport.serializeUser(function (user, done) {
      done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
      User.findById(id, function(err, user) {
        done(err, user);
      });
    });

    // use local strategy
    passport.use(new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password'
        },
        function (email, password, done) {
            return User.byEmail(email)
                .then(function (user) {
                    if (!user) return done(null, false, error);

                    user.authenticate(password, function(err, result) {
                        if(err) return done(err);

                        if(result) done(null, user);
                        else done(null, false, error);
                    });
                }, done);
        }
    ));
};