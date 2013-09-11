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
var Application = require('../app/models/application'),
    generateRandomString = require('../app/util/security').generateRandomString;

Application.by({ name: 'Chrome Extension' })
    .then(function (application) {
        if(!application) {
            generateRandomString()
                .then(function(client_id) {

                    //TODO there we need to specify redirect_uri it is required by spec
                    (new Application({ name: 'Chrome Extension', client_id: client_id })).save(function() {
                        console.log('Add temp application with client_id:' + client_id );
                    });
                });
        }
    })

module.exports = app
