// Container schema

var mongoose = require('mongoose')
  , Schema = mongoose.Schema

//Three types of containers: tag-container, import-container and seach-container
var ContainerSchema = new Schema({
	type: {type : Number, trim : true}
  , title: {type : String, trim : true}  
  , dashboard: {type : Schema.ObjectId, ref : 'Dashboard'}
  , user: {type : Schema.ObjectId, ref : 'User'}
  , createdAt  : {type : Date, default : Date.now}
  , filter: {source : String, trim : true}
})

ItemSchema.path('title').validate(function (title) {
  return title.length > 0
}, 'Item title cannot be blank')

ItemSchema.path('type').validate(function (type) {
  return type.length > 0
}, 'Item type cannot be blank')

ItemSchema.path('dashboard').validate(function (dashboard) {
  return dashboard == null
}, 'Item dashboard cannot be blank')

mongoose.model('Item', ItemSchema)
