require('../logger');

var Jobs = require('./manager');

var jobs = new Jobs();

//TODO add cluster module

jobs.add('check-url',  require('./jobs/check-url'));
jobs.add('download-html', require('./jobs/download-html'));
jobs.add('download', require('./jobs/download'));
jobs.add('process-html', require('./jobs/process-html'));
jobs.add('screenshot', require('./jobs/screenshot'));

var Q = require('q');
Q.longStackSupport = true;


// Load configurations
// if test env, load example file
var config = require('../config'),
    mongoose = require('mongoose');

//patch mongoose to add promises;
require('../util/mongoose-q');

// Bootstrap db connection
mongoose.connect(config.db.uri);
