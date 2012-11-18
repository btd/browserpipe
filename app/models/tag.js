// Tag schema

var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , validation = require('./validation')

var TagSchema = new Schema({
    label: {type : String, trim : true, validate: validation.nonEmpty}
  , path: {type : String, index : true, trim : true, validate: validation.nonEmpty}
  , user: {type : Schema.ObjectId, ref : 'User'}
  , createdAt  : {type : Date, default : Date.now}
});

module.exports = mongoose.model('Tag', TagSchema);
