/* jshint node: true */

var _ = require('lodash'),
    q = require('q'),
    User = require('../../models/user'),
    Item = require('../../models/item');

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
   
    User.byEmail(req.body.email)
        .then(function(_user) {
            if(_user) {
                req.flash('errors', [{ msg: 'Email already used' }]);
                res.redirect('/signup');
            } else {
                var user = new User(_.pick(req.body, 'email', 'name', 'password'));
                user.provider = 'local' //for passport

                var later = Item.newContainer({ title: 'Later', user: user });
                var archive = Item.newContainer({ title: 'Archive', user: user });
                // items
                var funVideosContainer = archive.addContainer({ title: 'Fun videos' });
                var coolSitesContainer = archive.addContainer({ title: 'Cool sites' });

                user.laterListboard = later;
                user.archiveListboard = archive;

                return user.saveWithPromise()
                    .then(function() {
                        return q.all([
                            later.saveWithPromise(),
                            archive.saveWithPromise(),
                            funVideosContainer.saveWithPromise(),
                            coolSitesContainer.saveWithPromise()
                        ]);
                    })
                    .then(function () {
                        req.login(user, function (err) {
                            if (err) return next(err);
                            res.redirect('/');
                        })
                    }, next)
            }
        }, next)
        .done();
}


//Find user by id
exports.user = function (req, res, next, id) {
    User.byId(id)
        .then(function(user) {
            if (!user) return res.status(404).render('404');

            req.profile = user;
            next()
        }).fail(next)
        .done();
}