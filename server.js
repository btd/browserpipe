/* Everbookmark main application entry file. */

var express = require('express')
  , fs = require('fs')
  , passport = require('passport')

// Load configurations
var env = process.env.NODE_ENV || 'development'
  , config = require('./config/config')[env]
  , auth = require('./authorization')

// Bootstrap db connection
console.log("Initializing database");
var mongoose = require('mongoose')
  , Schema = mongoose.Schema
mongoose.connect(config.db.uri)

// Bootstrap models
var models_path = __dirname + '/app/models'
  , model_files = fs.readdirSync(models_path)
model_files.forEach(function (file) {
  require(models_path+'/'+file)
})

// bootstrap passport config
require('./config/passport').boot(passport, config)

var app = express()                                       // express app
require('./settings').boot(app, config, passport)         // Bootstrap application settings

// Bootstrap routes
require('./config/routes')(app, passport, auth)

// Start the app by listening on <port>
var port = process.env.PORT || 4000
app.listen(port)
console.log("Everbookmark application started on port "+port+" in "+env+" mode");