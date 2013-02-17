var _ = require('lodash'),
    q = require('q'),
    passport = require('passport')
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Tag = mongoose.model('Tag'),
    Dashboard = mongoose.model('Dashboard'),
    Container = mongoose.model('Container')

module.exports = function(app) {
  var controller = new DashboardsController;

  _(controller).each(function(pathDescription, ignore) {
    _(pathDescription.action).each(function(callback, verb) {
      app[verb](pathDescription.path, callback);
    });
  });

  //TODO this is commmon for all routes wiill be available via req.param('userid') - small letters bacause uri param should be small letters?
  app.param('dashboardId', function (req, res, next, id) {    
    Dashboard
      .findOne({ _id : id })
      .exec(function (err, dashboard) {
        if (err) return next(err)        
        req.currentDashboard = dashboard
        next()
      })
  })
}

var DashboardsController = function() {

  function showDashboard(req, res) {
    if(req.isAuthenticated()){                       
      q.all([
          Dashboard.getAll(req.user),
          Container.getAll(req.user),
          Tag.getAll(req.user)                  
      ]).spread(function(dashboards, containers, tags){                
         res.render('main/home', {
          currentDashboardId: ((req.currentDashboard && req.currentDashboard.id) || req.user.currentDashboard), 
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

  return {
    showEmpty: {
      path: "/dashboards",
      action: {
        get: showDashboard
      }
    },
    show: {
      path: "/dashboards/:dashboardId",
      action: {
        get: showDashboard
      }
    },
    create: {
      path: "/dashboards",
      action: {
        post: function (req, res) {
          if(req.isAuthenticated()){
              var dashboard = new Dashboard(req.body)
              dashboard.user = req.user   
              req.user.currentDashboard = dashboard
              q.all([dashboard.saveWithPromise(),
                req.user.saveWithPromise()])
              .spread(function(){
                res.json('{"_id":"' + dashboard._id + '"}')
              }, function(err){
                //TODO: send corresponding number error
                res.json(err.errors) 
              }).done()
           }      
         else
           res.send(err.errors)
        }
      }
    },
    update: {
      path: "/dashboards/:dashboardId",
      action: {
        put: function (req, res) {
          if(req.isAuthenticated() && req.currentDashboard){
            var dashboard = req.currentDashboard;
            dashboard.label = req.body.label
            dashboard.saveWithPromise().then(function(){
              res.json('{"_id":"' + dashboard._id + '"}')
            }, function(err){
              //TODO: send corresponding number error
              res.json(err.errors) 
            }).done()
          }      
          else 
            res.send(err.errors)
        }
      }
    }                
  }
};
