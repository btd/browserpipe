/* Tagnfile.it main application entry file. */

var express = require('express')
  , passport = require('passport');

// loading db connection
require('./db')(passport);

var app = express()                                       

// Bootstrap application settings
require('./settings')(app, passport);

//first load authentication controller (because of passport)
require('./controllers/authentication')(app, passport);

//load other
['user'].forEach(function(controllerName) {
	require('./controllers/' + controllerName)(app);
});


// Start the app by listening on <port>
var port = process.env.PORT || 4000
app.listen(port)
console.log("Tagnfile.it application started on port "+port);