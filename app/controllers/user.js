var _ = require('lodash'),
    q = require('q'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Tag = mongoose.model('Tag'),
    Dashboard = mongoose.model('Dashboard')


//Init
exports.init = function (req, res) {
    if (req.isAuthenticated()) {
        if (req.user.currentDashboard)
            res.redirect('/dashboards/' + req.user.currentDashboard._id)
        else
            res.redirect('/dashboards') //No dashboard
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

//User just logged in
exports.session = function (req, res) {
    res.redirect('/')
}

//Create user
exports.create = function (req, res) {
    var user = new User(_.pick(req.body, 'email', 'name', 'password'));
    user.provider = 'local' //for passport

    //Creates initial data
    //Root tags
    var tagsTag = new Tag({ label: 'Tags', user: user });
    var trashTag = new Tag({ label: 'Trash', user: user });
    var importsTag = new Tag({ label: 'Imports', user: user });

    //Create tags
    var readLaterTag = tagsTag.createChildTag("Read Later");
    var coolSitesTag = tagsTag.createChildTag("Cool Sites");

    //Create imports tags
    var fileImports = importsTag.createChildTag("File");
    var twitterImports = importsTag.createChildTag("Twitter");
    var facebookImports = importsTag.createChildTag("Facebook");
    var deliciousImports = importsTag.createChildTag("Delicious");
    var pinboardImports = importsTag.createChildTag("Pinboard");

    //Create dashboard
    var dashboard = new Dashboard({ label: 'My initial dashboard', user: user})
        .addContainerByTag(readLaterTag)
        .addContainerByTag(coolSitesTag);

    //Sets current dashboard to recently created one
    user.currentDashboard = dashboard

    //TODO: manage rollback
    q.all([
            user.saveWithPromise(),
            tagsTag.saveWithPromise(),
            trashTag.saveWithPromise(),
            importsTag.saveWithPromise(),
            readLaterTag.saveWithPromise(),
            coolSitesTag.saveWithPromise(),
            fileImports.saveWithPromise(),
            twitterImports.saveWithPromise(),
            facebookImports.saveWithPromise(),
            deliciousImports.saveWithPromise(),
            pinboardImports.saveWithPromise(),
            dashboard.saveWithPromise()
        ])
        .spread(function () {
            res.format({

                html: function () {
                    req.login(user, function (err) {
                        if (err) return res.render('500')
                        return res.redirect('/dashboards/' + dashboard.id)
                    })
                },

                json: function () {
                    res.send({ _id: user._id });
                }
            });
        },function (err) {
            res.format({

                html: function () {
                    //TODO there should be redirect!!
                    res.render('users/signup', { errors: err.errors })
                },

                json: function () {
                    res.send({ errors: err.errors });
                }
            });
        }).done()
}

/*//Show profile
 exports.show = function (req, res) {
 var user = req.profile
 res.render('users/show', {
 title: user.name,
 user: user
 })
 }*/

//Find user by id
exports.user = function (req, res, next, id) {
    User
        .findOne({ _id: id })
        .populate('currentDashboard')
        .exec(function (err, user) {
            if (err) return next(err)
            if (!user) return next(new Error('Failed to load User ' + id))
            req.profile = user
            next()
        })
}