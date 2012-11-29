/* Tagnfile.it main application entry file. */

var express = require('express')
  , Resource = require('express-resource')
  , passport = require('passport');

// loading db connection
require('./db')(passport);

var app = express()                                       

// Bootstrap application settings
require('./settings')(app, passport);

//load other
['session'].forEach(function(controllerName) {
	require('./controllers/' + controllerName)(app);
});

module.exports = app;