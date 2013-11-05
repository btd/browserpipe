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
app.use(function(req, res, next) {
    // in api server we really do not care
    error.sendError(res, new error.NotFound('Route does not exists. Really!'));
});

app.use(function(err, req, res, next) {// interesting how it understand that i want err there, Function.length?
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

Application.by({ name: 'Chrome Extension' })
    .then(function (application) {
        if(!application) {
            application = new Application({ name: 'Chrome Extension', redirect_uri: 'http://localhost' });
            application.save(function(err) {
                console.log('Add temp application');
                console.log('client_id: ' + application.client_id);
                console.log('client_secret: ' + application.client_secret );
            });
        } else {
            console.log('client_id: ' + application.client_id);
            console.log('client_secret: ' + application.client_secret );
        }
    });

module.exports = app;
