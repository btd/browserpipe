// Folder schema

var mongoose = require('mongoose')
  , Schema = mongoose.Schema

var FolderSchema = new Schema({
    label: {type : String, trim : true}
  , path: {type : String, index : true, trim : true}
  , user: {type : Schema.ObjectId, ref : 'User'}
  , createdAt  : {type : Date, default : Date.now}
})

FolderSchema.path('label').validate(function (label) {
  return label.length > 0
}, 'Folder label cannot be blank')

FolderSchema.path('path').validate(function (path) {
  return path.length > 0
}, 'Folder path cannot be blank')

mongoose.model('Folder', FolderSchema)
