var _ = require('lodash'),
    q = require('q'),
    mongoose = require('mongoose'),
    Tag = mongoose.model('Tag'),
    Dashboard = mongoose.model('Dashboard'),
    Container = mongoose.model('Container'),
    Item = mongoose.model('Item')

//No dashboard
exports.showEmpty = showDashboard;

//Show dashboard
exports.show = showDashboard;

//Create dashboard
exports.create = function (req, res) {  
  if(req.isAuthenticated()){
    var dashboard = new Dashboard(req.body)
    dashboard.user = req.user   
    req.user.currentDashboard = dashboard
    q.all([dashboard.saveWithPromise(),
      req.user.saveWithPromise()])
    .spread(function(){
      res.json({ _id: dashboard._id })
    }, function(err){
      //TODO: send corresponding number error
      res.json(err.errors) 
    }).done()
  }      
  else
   res.send("invalid request")
}

//Update dashboard
exports.update = function (req, res) {  
  if(req.isAuthenticated() && req.currentDashboard){
    var dashboard = req.currentDashboard;
    dashboard.label = req.body.label
    dashboard.saveWithPromise().then(function(){
      res.json({ _id: dashboard._id })
    }, function(err){
      //TODO: send corresponding number error
      res.json(err.errors) 
    }).done()
  }      
  else 
    res.send("invalid request")
}

//Find dashboard by id
exports.dashboard = function (req, res, next, id) {
  Dashboard
    .findOne({ _id : id })
    .exec(function (err, dashboard) {
      if (err) return next(err)        
      req.currentDashboard = dashboard
      next()
    })
}

function showDashboard(req, res) {
  if(req.isAuthenticated()){                       
    q.all([
        Dashboard.getAll(req.user),
        Container.getAll(req.user),
        Tag.getAll(req.user)
    ]).spread(function(dashboards, containers, tags){                
        //We only load the ones from opened containers
        Item.getAllByFilters(
          req.user, 
          _.map(containers, function(container){ return container.get('filter');})
        ).then(function (items) {
          res.render('main/home', {
            currentDashboardId: ((req.currentDashboard && req.currentDashboard.id) || req.user.currentDashboard), 
            user: req.user, 
            dashboards: dashboards, 
            containers: containers, 
            items: items,
            tags: tags}
          );
        }, function (error) {
          res.render('500')
        });
     }, function(){
       res.render('500')
     }).done()                   
  }      
  else
   res.render('main/index')     
}