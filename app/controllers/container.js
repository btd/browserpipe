var _ = require('lodash'),
    q = require('q'),
    mongoose = require('mongoose')


//Create container
exports.create = function (req, res) {  
 
  var dashboard = req.user.currentDashboard;
  
  dashboard.addContainer(req.body).saveWithPromise().then(function(){
    res.json({ _id: dashboard._id })
  }, function(err){
    //TODO: send corresponding number error
    res.json(500, err.errors) 
  }).done()
 
}

//Update container
exports.update = function (req, res) {
  var dashboard = req.user.currentDashboard; 
  
  var containerIdx = _.findIndex(dashboard.containers, function(c) {
    return c._id.toString() === req.params.containerId;
  });

  if(containerIdx > 0) {
    var container = dashboard.containers[containerIdx];

    if(req.body.title)
      container.title = req.body.title
    if(req.body.dashboard)
      container.dashboard = req.body.dashboard
    if(req.body.filter)
      container.filter = req.body.filter
    if(req.body.order)
      container.path = req.body.order

    dashboard.containers.set(containerIdx, container);

    dashboard.saveWithPromise().then(function(){
      res.json({ _id:  container._id })
    }, function(err){
      //TODO: send corresponding number error
      res.json(err.errors) 
    }).done()
  } else {
    res.json(404, 'Not found');
  }
 
}



//Delete container
exports.destroy = function(req, res){
  var dashboard = req.user.currentDashboard;

  dashboard.containers.pull({ _id: req.params.containerId });
  
  dashboard.saveWithPromise().then(function(){
      res.json({ _id: req.params.containerId });
    }, function(err){
      //TODO: send corresponding number error
      res.json(500, err.errors) 
    }).done()
}