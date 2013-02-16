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
        if (!dashboard) return next(new Error('Failed to load Dashboard ' + id))
        req.currentDashboard = dashboard
        next()
      })
  })
}

var DashboardsController = function() {
  var path = '/dashboard/'; 

  return {
    show: {
      path: path + ":dashboardId",
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
                  currentDashboard: req.currentDashboard, 
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
    }      
  }
};
