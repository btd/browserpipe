var _ = require('lodash'),
    q = require('q'),
    passport = require('passport')
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Tag = mongoose.model('Tag'),
    Dashboard = mongoose.model('Dashboard'),
    Container = mongoose.model('Container')

module.exports = function(app) {
  var controller = new UsersController;

  _(controller).each(function(pathDescription, ignore) {
    _(pathDescription.action).each(function(callback, verb) {
      app[verb](pathDescription.path, callback);
    });
  });

  //TODO this is commmon for all routes wiill be available via req.param('userid') - small letters bacause uri param should be small letters?
  app.param('userid', function (req, res, next, id) {
    User
      .findOne({ _id : id })
      .exec(function (err, user) {
        if (err) return next(err)
        if (!user) return next(new Error('Failed to load User ' + id))
        req.profile = user
        next()
      })
  })
}

var UsersController = function() {
  var path = '/'; //root path

  return {
    init: {
      path: path,
      action: {
        get: function (req, res) {
          if(req.isAuthenticated()){
              //TODO: add intelligent loading logic. Such as the whole tree but where order < 50 (50 childs per tag)
              q.all([
                  Dashboard.getAll(req.user),
                  Container.getAll(req.user),
                  Tag.getAll(req.user)                  
              ]).spread(function(dashboards, containers, tags){                
                 res.render('main/home', {
                  user: req.user, 
                  dashboards: dashboards, 
                  containers: containers, 
                  tags: tags})
               }, function(){
                 res.render('500')
               }).done()                   
           }      
         else
           res.render('main/index')     
        }
      }
    },
    create: {
      path: path + "users",
      action: {
        post: function (req, res) {
          var user = new User(req.body)
          user.provider = 'local' //for passport

          //Creates initial data
          //Create tags
          var readLaterTag = new Tag({label: "Read Later", path: "tag", user: user})
          var coolSitesTag = new Tag({label: "Cool sites", path: "tag", user: user})
          var dashboard = new Dashboard({label: 'My initial dashboard', user: user})      
          var readLaterContainer = new Container({title: "Read Later", filter: "#\"Read Later\"", dashboard: dashboard, user: user})
          var coolSitesContainer = new Container({title: "Cool sites", filter: "#\"Cool Sites\"", dashboard: dashboard, user: user})
          user.currentDashboard = dashboard

          //TODO: manage rollback
          q.all([readLaterTag.saveWithPromise(),
            coolSitesTag.saveWithPromise(),
            dashboard.saveWithPromise(),
            readLaterContainer.saveWithPromise(),
            coolSitesContainer.saveWithPromise(),
            user.saveWithPromise()])
          .spread(function(){
            req.login(user, function(err) {
              if (err) return res.render('500')
              return res.redirect('/dashboard/' + )
            })
          }, function(err){
            res.render('users/signup', { errors: err.errors })
          }).done()                   
        }
      }
    },
    login: {
      path: path + "login", 
      action: {
        get: function (req, res) {
          res.render('users/login', {
            title: 'Login'
          })
        }
      }  
    },
    signup: {
      path: path + "signup", 
      action: {
        get: function (req, res) {
          res.render('users/signup', {
            title: 'Sign up'
          })
        }
      }  
    },
    logout: {
      path: path + "logout", 
      action: {
        get: function (req, res) {
          req.logout()
          res.redirect('/login')
        }
      }  
    },
    session: {
      path: path + "users/session", 
      action: {
        post: passport.authenticate('local', { 
          successRedirect: '/',
          failureRedirect: '/login' 
        })  
      }  
    }/*,
    show: {
      path: path + 'users/:userid',
      action: {
        get: function (req, res) {
          var user = req.profile
          res.render('users/show', {
              title: user.name
            , user: user
          })
        }
      }
    }*/
      
  }
};
