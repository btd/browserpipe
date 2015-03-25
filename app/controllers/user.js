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
        res.redirect('back');

        return;
    }

    var email = req.body.email.trim().toLowerCase();

    return User.byEmail(email)
        .then(function(_user) {
            if(_user) {
                req.flash('errors', [{ msg: 'Email already used' }]);
                res.redirect('back');
            } else {
                var user = new User(_.pick(req.body, 'email', 'name', 'password'));
                if(req.headers['accept-language']) {
                  user.langs = req.headers['accept-language'];
                }

                return user.saveWithPromise()
                  .then(function () {
                    req.login(user, function (err) {
                        if (err) return next(err);
                        res.redirect('/');
                    })
                  }, next);
            }
        }, next);
};