/* Tagnfile.it main application entry file. */

var express = require('express')
  , Resource = require('express-resource');

// Denis: I exclude passport for now - it seems that it is not need in API application

// loading db connection
require('./db')();

var app = express()      

//load modells
require('./models/user');
require('./models/tag');
require('./models/dashboard');
require('./models/container');

// Bootstrap application settings
require('./settings')(app);

//load other
require('./controllers/user')(app);
require('./controllers/dashboard')(app);

module.exports = app;