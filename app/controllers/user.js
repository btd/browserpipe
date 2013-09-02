/* jshint node: true */

var _ = require('lodash'),
    q = require('q'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    List = mongoose.model('List');

//Login form
exports.login = function (req, res) {
    var errors = _.map(req.flash().error, function(error) { return { msg: error}});
    res.render('users/login', {
        title: 'Login',
        errors: errors
    })
}

//Sign up form
exports.signup = function (req, res) {
    var errors = req.flash().errors;
    res.render('users/signup', {
        title: 'Sign up',
        errors: errors
    })
}

//Logout
exports.logout = function (req, res) {
    req.logout()
    res.redirect('/login')
}

//Create user
exports.create = function (req, res) {

    //Validate user input
    req.check('name', 'Please enter a first name').notEmpty();
    req.check('email', 'Please enter a valid email.').len(6,64).isEmail();    

    //If errors, flash or send them
    var errors = req.validationErrors();
    if (errors) {
        res.format({

            html: function () {
                req.flash('errors', errors);
                res.redirect('/signup');
            },

            json: function () {
                res.send(400, { errors: errors });
            }
        });
        
        return;
    }

    var user = new User(_.pick(req.body, 'email', 'name', 'password'));
    user.provider = 'local' //for passport
    
    //Creates initial data
    //Root lists
    var listsList = new List({ label: 'Lists', user: user });
    var trashList = new List({ label: 'Trash', user: user });
    var importsList = new List({ label: 'Imports', user: user });

    //Create lists
    var readLaterList = listsList.createChildList("Read Later");
    var coolSitesList = listsList.createChildList("Cool Sites");

    //Creates the future listboard
    user.addLaterListboard({ type: 1, label: 'My later listboard'})

    //Create a later listboard
    user.addFutureListboard({ type: 2, label: 'My future  listboard'})
        .addContainerByList(readLaterList)
        .addContainerByList(coolSitesList);
   
    //TODO: THIS IS TEMPORAL!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    //CREATES A NOW LISTBOARD
    //UNTIL IT CREATES IT AUTOMATICALLY VIA EXTENSION AND AP
    user.addNowListboard({type: 0, label: 'My Chrome Browser'})


    //Sets current listboard to recently created one
    user.saveWithPromise()
        .then(function() {
            q.all([
                    listsList.saveWithPromise(),
                    trashList.saveWithPromise(),
                    importsList.saveWithPromise(),
                    readLaterList.saveWithPromise(),
                    coolSitesList.saveWithPromise(),                    
                ])
                .spread(function () {
                    res.format({

                        html: function () {
                            req.login(user, function (err) {
                                if (err) return res.render('500')
                                return res.redirect('/welcome')
                            })
                        },

                        json: function () {
                            res.send({ _id: user._id });
                        }
                    });
                }).done()
        })
        .fail(function (err) {
            res.format({

                //TODO: log errors in server

                html: function () {                    
                    res.render('500');
                },

                json: function () {
                    res.send(400, { errors: err.errors });
                }
            });
        })
        .done();

}


//Find user by id
exports.user = function (req, res, next, id) {
    User.byId(id)
        .then(function(user) {
            if (!user) return next(new Error('Failed to load User ' + id))
            req.profile = user;
            next()
        }).fail(function(err) {
            next(err);
        });
}