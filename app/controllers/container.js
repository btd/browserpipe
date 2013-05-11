var _ = require('lodash'),
    q = require('q'),
    mongoose = require('mongoose'),
    Container = mongoose.model('Container')


//Create container
exports.create = function (req, res) {  
  if(req.isAuthenticated()){
    var container = new Container(req.body)
    container.user = req.user   
    q.all([container.saveWithPromise()])
    .spread(function(){
      res.json('{"_id":"' + container._id + '"}')
    }, function(err){
      //TODO: send corresponding number error
      res.json(err.errors) 
    }).done()
  }      
  else
   res.send("invalid request")
}

//Update container
exports.update = function (req, res) {  
  if(req.isAuthenticated() && req.currentContainer){
    var container = req.currentContainer;
    if(req.body.title)
      container.title = req.body.title
    if(req.body.dashboard)
      container.dashboard = req.body.dashboard
    if(req.body.filter)
      container.filter = req.body.filter
    if(req.body.order)
      container.path = req.body.order
    container.saveWithPromise().then(function(){
      res.json('{"_id":"' + container._id + '"}')
    }, function(err){
      //TODO: send corresponding number error
      res.json(err.errors) 
    }).done()
  }      
  else 
    res.send("invalid request")
}

//Find container by id
exports.container = function (req, res, next, id) {
  Container
    .findOne({ _id : id })
    .exec(function (err, container) {
      if (err) return next(err)        
      req.currentContainer = container
      next()
    })
}

//Delete container
exports.destroy = function(req, res){
  if(req.isAuthenticated() && req.currentContainer){
    var container = req.currentContainer
    container.remove(function(err){
      res.json('{"_id":"' + container._id + '"}')
    })
  }      
  else 
    res.send("invalid request")
}