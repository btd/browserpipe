// Dashboard schema

var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , validation = require('./validation')
  , q = require('q')

var DashboardSchema = new Schema({
	label: {type : String, trim : true, validate: validation.nonEmpty, unique: true}
  , user: {type : Schema.ObjectId, ref : 'User'}
  , createdAt: {type : Date, default : Date.now}
})

DashboardSchema.method('saveWithPromise', function() {
  var deferred = q.defer();	
  this.save(function (err) {
    if (err) deferred.reject(err)
	else deferred.resolve()    
  })
  return deferred.promise;
})

var Dashboard = mongoose.model('Dashboard', DashboardSchema);

Dashboard.create = function(label, path, user){	
  var deferred = q.defer();	
  var dashboard = new Dashboard({
    label: label,
    path: path,
    user: user
  })
  dashboard.save(function (err) {
    if (err) error(err)
	else deferred.resolve(dashboard)    
  })
  return deferred.promise;
}

Dashboard.getAll = function(user){
  var deferred = q.defer();
  this
	.find({user: user}, '_id label')
	.exec(function(err, dashboards) {
	  // TODO manage errors propertly
	  if (err) error(err)
	  else deferred.resolve(dashboards)
	})   
  return deferred.promise;
}

mongoose.model('Dashboard', DashboardSchema)
