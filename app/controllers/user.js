/* jshint node: true */

var _ = require('lodash'),
    User = require('../../models/user'),
    Item = require('../../models/item');

var Promise = require('bluebird');

//Login form
exports.login = function (req, res) {
    var errors = _.map(req.flash().error, function(error) { return { msg: error}});
    res.render('users/login', {
        title: 'Login',
        errors: errors
    });
}

//Sign up form
exports.signup = function (req, res) {
    var errors = req.flash('errors');
    res.render('users/signup', {
        title: 'Sign up',
        errors: errors
    });
}

//Logout
exports.logout = function (req, res) {
    req.logout();
    res.redirect('/login');
}

//Create user
exports.create = function (req, res, next) {

    //Validate user input
    req.check('name', 'Please enter a first name').notEmpty();
    req.check('email', 'Please enter a valid email').isEmail();
    req.check('password', 'Please enter a non empty password').notEmpty();

    //If errors, flash or send them
    var errors = req.validationErrors();
    if (errors) {
        req.flash('errors', errors);
        res.redirect('/signup');

        return;
    }

    var email = req.body.email.trim().toLowerCase();

    return User.byEmail(email)
        .then(function(_user) {
            if(_user) {
                req.flash('errors', [{ msg: 'Email already used' }]);
                res.redirect('/signup');
            } else {
                var user = new User(_.pick(req.body, 'email', 'name', 'password'));
                user.provider = 'local' //for passport
                user.email = email;
                if(req.headers['accept-language']) {
                  user.langs = req.headers['accept-language'];
                }

                var browser = Item.newContainer({ title: 'Archive', user: user });
                var archive = Item.newContainer({ title: 'Browser', user: user });
                user.browser = browser;
                user.archive = archive;

                return Promise.cast(user.save())
                    .then(function() {
                        return browser.save();
                    })
                    .then(function () {
                        req.login(user, function (err) {
                            if (err) return next(err);
                            res.redirect('/');
                        })
                    }, next)
            }
        }, next);
}


//Find user by id
exports.user = function (req, res, next, id) {
    return User.byId(id)
        .then(function(user) {
            if (!user) return res.status(404).render('404');

            req.profile = user;
            next()
        }, next);
}
