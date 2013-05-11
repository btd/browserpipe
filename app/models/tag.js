// Tag schema

var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  validation = require('./validation'),
  q = require('q')

var TagSchema = new Schema({
  label: {type : String, trim : true, validate: validation.nonEmpty},
  path: {type : String, index : true, trim : true},
  user: {type : Schema.ObjectId, ref : 'User'},
  createdAt  : {type : Date, default : Date.now}
});

TagSchema.path('label').validate(function (label) {
  return label.length > 0
}, 'Tag label cannot be blank')
/*
//Root tag has blank path, but it is not saved in db
TagSchema.path('path').validate(function (path) {	
  return path.length > 0
}, 'Tag path cannot be blank')*/

TagSchema.method('saveWithPromise', function() {
  var deferred = q.defer();	
  this.save(function (err) {
    if (err) deferred.reject(err)
	else deferred.resolve()    
  })
  return deferred.promise;
})

var Tag = mongoose.model('Tag', TagSchema);

Tag.getAll = function(user){
  var deferred = q.defer();
  this
	.find({user: user})
	//.populate('user', 'label', 'path')
	.sort({'path': 1}) // sort by date
	// .limit(perPage)
	// .skip(perPage * page)
	.exec(function(err, tags) {
	  // TODO manage errors propertly
	  if (err) error(err)
	  else deferred.resolve(tags)
	})   
  return deferred.promise;
}


//POSIBLE NEEDED FILTER TAG FUNCTIONS FOR THE FUTURE WHEN THEY ARE NOT ALL HOLD IN MEMORY IN THE CLIENT

Tag.getChildrenByPath = function(user, path, success, error){
  this
	.find({user: user, path : path })
	//.populate('user', 'label', 'path')
	.sort({'path': 1}) // sort by date
	// .limit(perPage)
	// .skip(perPage * page)
	.exec(function(err, tags) {
	  // TODO manage errors propertly
	  if (err) error(err)
	  else success(tags)
	})   
}
Tag.getTagAndChildrenByPath = function(user, parentPath, path, success, error){
  this
	.find({user: user, path : { $in : [path, parentPath] } })
	//.populate('user', 'label', 'path')
	.sort({'path': 1}) // sort by date
	// .limit(perPage)
	// .skip(perPage * page)
	.exec(function(err, tags) {
	  // TODO manage errors propertly
	  if (err) error(err)
	  else success(tags)
	})   
}
Tag.getAllDescendantByPath = function(user, path, success, error){
  this
	.find({user: user, path : new RegExp("^" + path) })
	//.populate('user', 'label', 'path')
	.sort({'path': 1}) // sort by date
	// .limit(perPage)
	// .skip(perPage * page)
	.exec(function(err, tags) {
	  // TODO manage errors propertly
	  if (err) error(err)
	  else success(tags)
	})   
}

module.exports = mongoose.model('Tag', TagSchema);
