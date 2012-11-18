var _ = require('lodash');
var User = require('../models/user');

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
  var path = '/users';

  return {
    create: {
      path: path,
      action: {
        post: function (req, res) {
          (new User(req.body)).save(function (err) {//TODO more correctly (from sass, soa, rest and other clever abbriviations point of view) do redirect here instead of rendering templates 
            if (err) return res.render('users/signup', { errors: err.errors })
    
            req.login(user, function(err) {
              if (err) return next(err)
              return res.redirect('/')
            })
          })
        }
      }
    },
    show: {
      path: path + '/:userid',
      action: {
        get: function (req, res) {
          var user = req.profile
          res.render('users/show', {
              title: user.name
            , user: user
          })
        }
      }
    }
      
  }
};
