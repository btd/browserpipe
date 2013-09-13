var app = require('./express');

require('./oauth2')(app);
require('./routes')(app);

// Load configurations
// if test env, load example file
var config = require('../config/config'),
    mongoose = require('mongoose');

//patch mongoose to add promises;
require('../app/util/mongoose-q');

// Bootstrap db connection
mongoose.connect(config.db.uri);


//TODO remove later
var Application = require('../app/models/application');

Application.by({ name: 'Chrome Extension' })
    .then(function (application) {
        if(!application) {
            application = new Application({ name: 'Chrome Extension', redirect_uri: 'http://localhost' });
            application.save(function(err) {
                console.log('Add temp application with client_id: ' + application.client_id + ' client_secret: ' + application.client_secret );
            });
        }
    })

module.exports = app
