require('newrelic');

//var heapdump = require('heapdump');

var app = require('./app/server');

var port = process.env.PORT || 4000;

app.listen(port);

console.log("Listboard.it application started on port " + port);