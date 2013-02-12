var _ = require('lodash'),
        passport = require('passport')
        mongoose = require('mongoose'),
        User = mongoose.model('User'),
        Tag = mongoose.model('Tag');

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
             //Load inline the root tag
             //TODO: add intelligent loading logic. Such as the whole tree but where order < 50 (50 childs per tag)
             Tag.getAll(req.user, function(tags){
               res.render('main/home', {user: req.user, tags: tags})
             }, function(){
               res.render('500')
             })        
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

          //create initial data
          //var dashboard = new Dashboard({label: 'My initial dashboard', user: user})      
          //dashboard.save()
          //sets initial dashboard as current
          //user.currentDashboard = dashboard

          user.save(function (err) {//TODO more correctly (from sass, soa, rest and other clever abbriviations point of view) do redirect here instead of rendering templates 
            if (err) return res.render('users/signup', { errors: err.errors })
            
            req.login(user, function(err) {
              if (err) return next(err)
              return res.redirect('/')
            })
          })
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
