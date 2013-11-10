var environment = process.env.NODE_ENV || 'development';

var _ = require('lodash'),
    path = require('path');

var common = {
    'storePath': './public/screenshots', // path where jobs server will store all its content, maybe we will need to separate it
    'storeUrl' : '/screenshots', // url to access the store
    'screenshot': { // default screenshot settings
        format: 'jpg',
        width: 800,
        height: 600,
        defaultName: 'screenshot'
    },
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
            preprocess: ['img/index/**', 'font/**', 'css/index.css', 'js/index.js'],
            manifest: path.join(__dirname, 'compiled-assets')
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

    config[key].env = key;
});

module.exports = config[environment];
