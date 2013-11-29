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
        User.byId(id)
            .then(done.bind(undefined, null), done)
            .done();
    });

    // use local strategy
    passport.use(new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password'
        },
        function (email, password, done) {
            User.byEmail(email)
                .then(function (user) {
                    if (!user) return done(null, false, error);

                    user.authenticate(password, function(err, result) {
                        if(err) return done(err);

                        if(result) done(null, user);
                        else done(null, false, error);
                    });
                }, done)
                .done();
        }
    ));
};