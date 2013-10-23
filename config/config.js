var environment = process.env.NODE_ENV || 'development';

var _ = require('lodash'),
    path = require('path');

var common = {
    oauth2: {
        authCode: {
            length: 256,
            expires_in: 60000 * 10
        },
        accessToken: {
            length: 1024
        }
    },
    'socket.io': {
        userUpdateRedisKeyPrefix: 'user_update:'
    },
    redis: {
        host: '127.0.0.1',
        port: 6379,
        options: {}
    }
};

var config = {
    test: {
        db: {
            uri: 'mongodb://localhost/listboardit-test'
        },
        mincer: {
            url: '/public',
            roots: './public'
        },
        'socket-io': {
            'log level': 1
        }
    },
    development: {
        db: {
            uri: 'mongodb://localhost/listboardit-dev'
        },
        mincer: {
            url: '/public',
            roots: './public'
        }
    },
    staging: {
        db: {
            uri: 'mongodb://localhost/listboardit-stage'
        },
        mincer: {
            url: '/public',
            roots: './public',
            preprocess: ['img/index/**', 'font/**', 'css/index.css', 'js/apps/index.js'],
            manifest: path.join(__dirname, '..', 'compiled-assets')
        }
    },
    production: {
        db: {
            uri: 'mongodb://localhost/listboardit'
        },
        mincer: {
            url: '/public',
            roots: './public',
            preprocess: ['img/index/**', 'font/**', 'css/index.css', 'js/apps/index.js'],
            manifest: path.join(__dirname, '..', 'compiled-assets')
        }
    }
};

Object.keys(config).forEach(function (key) {
    config[key] = _.merge(config[key], common);
    config[key]["connect-mongo"] = {
        auto_reconnect: true,
        collection: 'sessions',
        url: config[key].db.uri
    }
});

config[environment].env = environment;

module.exports = config[environment];
