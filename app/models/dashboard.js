// Dashboard schema

var mongoose = require('mongoose')
  , Schema = mongoose.Schema

var DashboardSchema = new Schema({
	label: {type : String, trim : true}
  , user: {type : Schema.ObjectId, ref : 'User'}
  , createdAt  : {type : Date, default : Date.now}
})

DashboardSchema.path('label').validate(function (label) {
  return label.length > 0
}, 'Dashboard label cannot be blank')

mongoose.model('Dashboard', DashboardSchema)
