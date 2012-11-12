// Tag schema

var mongoose = require('mongoose')
  , Schema = mongoose.Schema

var TagSchema = new Schema({
    label: {type : String, trim : true}
  , path: {type : String, index : true, trim : true}
  , user: {type : Schema.ObjectId, ref : 'User'}
  , createdAt  : {type : Date, default : Date.now}
})

TagSchema.path('label').validate(function (label) {
  return label.length > 0
}, 'Tag label cannot be blank')

TagSchema.path('path').validate(function (path) {
  return path.length > 0
}, 'Tag path cannot be blank')

exports.Tag = mongoose.model('Tag', TagSchema);
