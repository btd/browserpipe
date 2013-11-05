var express = require('express');
require('express-namespace');

var logger = require('rufus').getLogger('express');

var app = express();

app.set('views', __dirname + '/view');
app.set('view engine', 'jade');
app.set('view options', { 'layout': false });

app.use(express.static(__dirname + '/../public'));

// proxy logging via rufus
app.use(express.logger({ format: 'short', stream: {
    write: function(msg) {
        logger.info(msg.substr(0, msg.length - 1));
    }
}}));

module.exports = app;
