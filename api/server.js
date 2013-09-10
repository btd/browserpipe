var app = require('./express');

require('./oauth2')(app);

// Load configurations
// if test env, load example file
var config = require('../config/config'),
    mongoose = require('mongoose');

//patch mongoose to add promises;
require('../app/util/mongoose-q');

// Bootstrap db connection
mongoose.connect(config.db.uri);

module.exports = app
