/* Tagnfile.it main application entry file. */

var express = require('express')
  , Resource = require('express-resource');

// Denis: I exclude passport for now - it seems that it is not need in API application

// loading db connection
require('./db')();

var app = express()                                       

// Bootstrap application settings
require('./settings')(app);

//load other
['session'].forEach(function(controllerName) {
	require('./controllers/' + controllerName)(app);
});

module.exports = app;