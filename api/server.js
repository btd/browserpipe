require('../logger');

var app = require('./express');
var error = require('./error');

var logger = require('rufus').getLogger('express');

var Q = require('q');
Q.longStackSupport = true;

require('./oauth2')(app);
require('./routes')(app);

app.use(app.router); //really not sure what it did; because without this row also everything working just fine
// as we add every routes

// 404 handler it should be last in chain
app.use(function(req, res) {
    // in api server we really do not care
    error.sendError(res, new error.NotFound('Route does not exists. Really!'));
});


app.use(function(err, req, res) {// interesting how it understand that i want err there, Function.length?
    logger.error('Exception in express', err)
    // we do not show to the user what really happen, just tell that it is bad
    error.sendError(res, new error.ServerError);
});


// Load configurations
// if test env, load example file
var config = require('../config'),
    mongoose = require('mongoose');

//patch mongoose to add promises;
require('../util/mongoose-q');

// Bootstrap db connection
mongoose.connect(config.db.uri);


//TODO remove later when we will have something more stable
var Application = require('../models/application');
Application.by({ redirect_uri: 'http://api.local.listboard.it:4001/nothing' }).then(function(app) {
    //app exists
    if(app) {
        app.client_id = "c1ac6c64c0e5b3d89742ca0b0c21f17a6ad09653cbc5485445205ff62d46f744b653edbcf44a789a7c08d46878fba68dc039a56eda99104bc2de8a6a953bf217";
        app.client_secret = "0010b153d6ab89f94ada6650745c2ec579de72cf41facdc0441f20cf6d080aacd3d9dd302886cbc8bb78fc067805bd65a2f7ab1fdc2ca93ef5b4eaf2d94e54f6"
    } else {
        app = new Application({
            name: 'Chrome Extension',
            "client_id" : "c1ac6c64c0e5b3d89742ca0b0c21f17a6ad09653cbc5485445205ff62d46f744b653edbcf44a789a7c08d46878fba68dc039a56eda99104bc2de8a6a953bf217",
            "client_secret" : "0010b153d6ab89f94ada6650745c2ec579de72cf41facdc0441f20cf6d080aacd3d9dd302886cbc8bb78fc067805bd65a2f7ab1fdc2ca93ef5b4eaf2d94e54f6",
            "redirect_uri" : [
                "http://localhost",
                "http://api.local.listboard.it:4001/nothing"
            ]
        })
    }

    app.save(function() {
        console.log("Application saved");
    })
});

module.exports = app;
