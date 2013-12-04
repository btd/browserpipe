/* jshint node: true */

var _ = require('lodash'),
    q = require('q'),
    User = require('../../models/user'),
    Folder = require('../../models/folder');

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

                //Create later listboard, there will be only 1 of type: 1
                user.addListboard({ type: 1, label: 'Later listboard'});
                
                //Create a root folder
                var rootFolder = new Folder({ label: 'Archive', user: user });
                
                //Create child folders
                var readLaterFolder = rootFolder.createChildFolder("Fun videos");
                var coolSitesFolder = rootFolder.createChildFolder("Cool Sites");

                return user.saveWithPromise()
                    .then(function() {
                        return q.all([
                            rootFolder.saveWithPromise(),
                            readLaterFolder.saveWithPromise(),
                            coolSitesFolder.saveWithPromise()
                        ]);
                    })
                    .then(function () {
                        req.login(user, function (err) {
                            if (err) return next(err);
                             res.redirect('/');
                        })
                    })
                    .fail(next)
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