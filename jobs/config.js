var _ = require('lodash');

var common = {
    'storePath': './public/screenshots',
    'screenshot': {
        format: 'jpg',
        width: 800,
        height: 600,
        defaultName: 'screenshot'
    },
    redis: {
        host: '127.0.0.1',
        post: 6379
    }
};

var config = {
    test: {},
    development: {},
    staging: {},
    production: {}
};

_.each(config, function(value, key) {
    config[key] = _.merge(common, config[key]);
});

module.exports = config[process.env.NODE_ENV || 'development'];

