var express = require('express');
require('express-namespace');


var app = express();

app.set('views', __dirname + '/view');
app.set('view engine', 'jade');
app.set('view options', { 'layout': false });

app.use(express.static(__dirname + '/../public'));


app.configure('development', function () {
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));

    //set up colour logger for dev
    app.use(express.logger('dev'));
});

module.exports = app;