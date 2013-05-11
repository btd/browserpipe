/* Tagnfile.it main application entry file. */

var express = require('express'),
  	fs = require('fs'),
  	passport = require('passport')

// Load configurations
// if test env, load example file
var config = require('./config/config')
  , auth = require('./config/middlewares/authorization')
  , mongoose = require('mongoose')

// Bootstrap db connection
mongoose.connect(config.db.uri)

// Bootstrap models
var models_path = __dirname + '/app/models'
fs.readdirSync(models_path).forEach(function (file) {
  require(models_path+'/'+file)
})

// bootstrap passport config
require('./config/passport')(passport, config)

var app = express()

// Bootstrap express settings
require('./config/express')(app, config, passport);

// Bootstrap routes
require('./config/routes')(app, passport, auth)

// Start the app by listening on <port>
var port = process.env.PORT || 4000
app.listen(port)
console.log("Tagnfile.it application started on port "+port);

// expose app
exports = module.exports = app
