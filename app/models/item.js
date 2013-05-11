// Item schema

var mongoose = require('mongoose'),
  Schema = mongoose.Schema

//There are to types of items: tag-item and note-item
var ItemSchema = new Schema({
	type: {type : Number, trim : true},
  tags: [{type : String, trim : true}],
  user: {type : Schema.ObjectId, ref : 'User'},
  createdAt  : {type : Date, default : Date.now},
  //tag-item
  title: {type : String, trim : true},
  url: {type : String, trim : true},
  //note-item & tag-item
  note: {type : String, trim : true}
})

ItemSchema.path('type').validate(function (type) {
  return type.length > 0
}, 'Item type cannot be blank')

mongoose.model('Item', ItemSchema)
