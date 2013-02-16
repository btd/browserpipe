// Container schema

var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , validation = require('./validation')
  , q = require('q')

//Three types of containers: tag-container, import-container and seach-container
var ContainerSchema = new Schema({
    title: {type : String, trim : true}  
  , dashboard: {type : Schema.ObjectId, ref : 'Dashboard'}
  , user: {type : Schema.ObjectId, ref : 'User'}
  , createdAt  : {type : Date, default : Date.now}
  , filter: {type : String, trim : true}
})

ContainerSchema.path('title').validate(function (title) {
  return title.length > 0
}, 'Item title cannot be blank')

ContainerSchema.path('dashboard').validate(function (dashboard) {
  return dashboard != null
}, 'Item dashboard cannot be blank')

ContainerSchema.path('title').validate(function (title) {
  return 
}, 'Item title cannot be blank')

ContainerSchema.pre("save", function(next) {
    var self = this;
    mongoose.models["Container"].findOne({title: self.title, user: self.user}, function(err, results) {
        if(err) {
            next(err);
        } else if(results) { //there was a result found, so the title exists
            self.invalidate("title","title must be unique");
            next(new Error("title must be unique"));
        } else {
            next();
        }
    });
    next();
});

ContainerSchema.method('saveWithPromise', function() {
  var deferred = q.defer();	
  this.save(function (err) {
    if (err) deferred.reject(err)
	else deferred.resolve()    
  })
  return deferred.promise;
})

var Container = mongoose.model('Container', ContainerSchema);

Container.getAll = function(user){
  var deferred = q.defer();
  this
	.find({user: user})
	.exec(function(err, containers) {
	  // TODO manage errors propertly
	  if (err) error(err)
	  else deferred.resolve(containers)
	})   
  return deferred.promise;
}

mongoose.model('Container', ContainerSchema)