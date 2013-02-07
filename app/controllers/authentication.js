
var _ = require('lodash');
var passport = require('passport');

module.exports = function(app) {
  var controller = new AuthenticationController;

  _(controller).each(function(pathDescription, ignore) {
    _(pathDescription.action).each(function(callback, verb) {
      app[verb](pathDescription.path, callback);
    });
  });
}

var AuthenticationController = function() {
  var loginPath = '/login';
  return {
    login: {
      path: loginPath,
      action: {
        get: function(req, res) {
          res.render('users/login', {
            title: 'Login'
          });
        },
        post: passport.authenticate('local', 
          { 
            successRedirect: '/', 
            failureRedirect: loginPath
          })
      }
    },
    signup: {
      path: '/signup',
      action: {
        get: function (req, res) {
          res.render('users/signup', {
            title: 'Sign up'
          });
        }
      }
    },
    logout: {
      path: '/logout',
      action: {
        get: function (req, res) {
          req.logout();
          res.redirect(this.login.path);
        }
      }
    }
  }
};
