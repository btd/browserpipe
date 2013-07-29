var mongoose = require('mongoose'),
    LocalStrategy = require('passport-local').Strategy,
    User = mongoose.model('User');


module.exports = function (passport) {

    // serialize sessions
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.byId(id)
            .then(done.bind(undefined, null))
            .fail(done);
    });

    // use local strategy
    passport.use(new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password'
        },
        function (email, password, done) {
            User.byEmail(email)
                .then(function (user) {
                    if (!user) {
                        return done(null, false, { message: 'Unknown user' })
                    }
                    if (!user.authenticate(password)) {
                        return done(null, false, { message: 'Invalid password' })
                    }
                    return done(null, user)
                })
                .fail(done);
        }
    ));
};