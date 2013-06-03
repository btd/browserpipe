var _ = require('lodash'),
    q = require('q'),
    mongoose = require('mongoose'),
    Dashboard = mongoose.model('Dashboard');


//Create container
exports.create = function (req, res) {  
  Dashboard.findOne({ _id: req.params.dashboardId, user: req.user }).exec(function(err, dashboard) {
    if(err) res.json(500, err.errors);
    else {
      dashboard.addContainer(_.pick(req.body, 'title', 'filter', 'type')).saveWithPromise().then(function(){
        res.json({ _id: dashboard._id })
      }, function(err){
        //TODO: send corresponding number error
        res.json(500, err.errors) 
      }).done()
    }
  });
}

//Update container
exports.update = function (req, res) {
  Dashboard.findOne({ _id: req.params.dashboardId, user: req.user }).exec(function(err, dashboard) {
    if(err) res.json(500, err.errors);
    else {
      var containerIdx = _.findIndex(dashboard.containers, function(c) {
        return c._id.toString() === req.params.containerId;
      });

      if(containerIdx > 0) {
        var container = dashboard.containers[containerIdx];

        _.merge(container, _.pick(req.body, 'title', 'filter'));

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
  });
 
}



//Delete container
exports.destroy = function(req, res){
  Dashboard.findOne({ _id: req.params.dashboardId, user: req.user }).exec(function(err, dashboard) {
    if(err) res.json(500, err.errors);
    else {
      dashboard.containers.pull({ _id: req.params.containerId });
  
      dashboard.saveWithPromise().then(function(){
        res.json({ _id: req.params.containerId });
      }, function(err){
        //TODO: send corresponding number error
        res.json(500, err.errors) 
      }).done()
    }
  });
}