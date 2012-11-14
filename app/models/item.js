// Item schema

var mongoose = require('mongoose')
  , Schema = mongoose.Schema

var ItemSchema = new Schema({
	type: {type : Number, trim : true}
  , title: {type : String, trim : true}
  , url: {type : String, trim : true}
  , notes: {type : String, trim : true}
  , tags: [{type : String, trim : true}]
  , user: {type : Schema.ObjectId, ref : 'User'}
  , createdAt  : {type : Date, default : Date.now}
})

ItemSchema.path('type').validate(function (type) {
  return type.length > 0
}, 'Item type cannot be blank')

mongoose.model('Item', ItemSchema)
