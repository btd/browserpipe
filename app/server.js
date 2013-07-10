/* Listboard.it main application entry file. */

var express = require('express'),
    fs = require('fs'),
    passport = require('passport')

// Load configurations
// if test env, load example file
var config = require('../config/config')
    , mongoose = require('mongoose');

//patch mongoose to add promises;
require('./util/mongoose-q');

// Bootstrap db connection
mongoose.connect(config.db.uri)

// Bootstrap models
var models_path = __dirname + '/models'
fs.readdirSync(models_path).forEach(function (file) {
    require(models_path+'/'+file)
})

// bootstrap passport config
require('../config/passport')(passport, config)

var app = express()

// Bootstrap express settings
require('../config/express')(app, config, passport);

// Bootstrap routes
require('../config/routes')(app, passport)

module.exports = app;

