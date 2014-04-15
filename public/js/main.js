//add some globals, need to remove them later
process = { env: { NODE_ENV: 'browser' } };

$ = jQuery = require('jquery');

require('./router')();
