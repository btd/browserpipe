var _ = require('lodash'),
    q = require('q'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    List = mongoose.model('List'),
    Listboard = mongoose.model('Listboard')


//Init
exports.init = function (req, res) {
    if (req.isAuthenticated()) {
        if (req.user.currentListboard)
            res.redirect('/listboards/' + req.user.currentListboard._id)
        else
            res.redirect('/listboards') //No listboard
    }
    else
        res.render('main/index')
}


//Login form
exports.login = function (req, res) {
    res.render('users/login', {
        title: 'Login'
    })
}

//Sign up form
exports.signup = function (req, res) {
    res.render('users/signup', {
        title: 'Sign up'
    })
}

//Logout
exports.logout = function (req, res) {
    req.logout()
    res.redirect('/login')
}

//Create user
exports.create = function (req, res) {
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

    //Create imports lists
    var fileImports = importsList.createChildList("File");
    var twitterImports = importsList.createChildList("Twitter");
    var facebookImports = importsList.createChildList("Facebook");
    var deliciousImports = importsList.createChildList("Delicious");
    var pinboardImports = importsList.createChildList("Pinboard");

    //Create listboard
    var listboard = new Listboard({ label: 'My initial listboard', user: user})
        .addContainerByList(readLaterList)
        .addContainerByList(coolSitesList);

    //Sets current listboard to recently created one
    user.currentListboard = listboard;

    user.saveWithPromise()
        .then(function() {
            q.all([
                    listsList.saveWithPromise(),
                    trashList.saveWithPromise(),
                    importsList.saveWithPromise(),
                    readLaterList.saveWithPromise(),
                    coolSitesList.saveWithPromise(),
                    fileImports.saveWithPromise(),
                    twitterImports.saveWithPromise(),
                    facebookImports.saveWithPromise(),
                    deliciousImports.saveWithPromise(),
                    pinboardImports.saveWithPromise(),
                    listboard.saveWithPromise()
                ])
                .spread(function () {
                    res.format({

                        html: function () {
                            req.login(user, function (err) {
                                if (err) return res.render('500')
                                return res.redirect('/listboards/' + listboard.id)
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

                html: function () {
                    //TODO there should be redirect!!
                    res.render('users/signup', { errors: err.errors })
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