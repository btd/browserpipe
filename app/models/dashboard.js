// Dashboard schema

var mongoose = require('mongoose'),
  _ = require('lodash'),
  Schema = mongoose.Schema,
  validation = require('./validation'),
  q = require('q')

var DashboardSchema = new Schema({
	label: {type : String, trim : true, validate: validation.nonEmpty },
  containers: [{
    type: {type : Number, trim : true}, //0: blank, 1: tag, 2: search, 3: import, 4: device, 5: trash
    title: {type : String, trim : true, validate: validation.nonEmpty},
    createdAt  : {type : Date, default : Date.now},
    filter: {type : String, trim : true} 
  }],
  user: {type : Schema.ObjectId, ref : 'User'},
  createdAt: {type : Date, default : Date.now}
})

DashboardSchema.methods.saveWithPromise = function() {
  var deferred = q.defer();	
  this.save(function (err) {
    if (err) deferred.reject(err)
	else deferred.resolve()    
  })
  return deferred.promise;
}

DashboardSchema.methods.addContainerByTag = function(tag) {
  this.containers.push({
    type: 1,
    title: tag.label,
    filter: tag.fullPath
  });
  return this;
};

DashboardSchema.statics.getAll = function(user) {
  var deferred = q.defer();
  this
	.find({user: user})
	.exec(function(err, dashboards) {
	  // TODO manage errors propertly
	  if (err) error(err)
	  else deferred.resolve(dashboards)
	})   
  return deferred.promise;
}

DashboardSchema.pre("save", function(next) {
    var repeated = _(this.containers).countBy(function(container) {
      return container.title;
    }).find(function(key, value) {
      return value > 1;
    });

    if(repeated) {
      self.invalidate("title","title must be unique");
      next(new Error("title must be unique, but '" + repeated + "' repeat"));
    } else {
      next();
    }
});

mongoose.model('Dashboard', DashboardSchema);
