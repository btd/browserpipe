require('../logger');

var Promise = require('bluebird');
Promise.longStackTraces();

var express = require('express'),
    fs = require('fs'),
    passport = require('passport');

// Load configurations
// if test env, load example file
var config = require('../config'),
    mongoose = require('mongoose');

// Bootstrap db connection
mongoose.connect(config.db.uri);
// Bootstrap models
var models_path = __dirname + '/../models';
fs.readdirSync(models_path).forEach(function (file) {
    require(models_path+'/'+file);
});

// bootstrap passport config
require('./passport')(passport, config);

var app = express();

// Bootstrap express settings
var server = require('./express')(app, passport);

var logger = require('rufus').getLogger('app.unhandled');

Promise.onPossiblyUnhandledRejection(function(e, promise){
  logger.error('promise unhandled error', e);
  throw e;
});

module.exports = server;

