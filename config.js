var environment = process.env.NODE_ENV || 'development';

var _ = require('lodash'),
    path = require('path');

var common = {
    cookieSecret: 'd5bSD5N0dl3Vs1SwXw6pMkxS',
    storePath: './public/screenshots', // path where jobs server will store all its content, maybe we will need to separate it
    storeUrl: '/screenshots',
    screenshot: { // default screenshot settings
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
    },
    mincer: {
        url: '/public',
        roots: './public'
    },
};

var config = {
    test: {
        db: {
            uri: 'mongodb://localhost/listboardit-test'
        },
        'socket-io': {
            'log level': 1
        }
    },
    development: {
        db: {
            uri: 'mongodb://localhost/listboardit-dev'
        }
    },
    staging: {
        db: {
            uri: 'mongodb://localhost/listboardit-stage'
        },
        mincer: {
            preprocess: [
                'img/index/**', 
                'font/**', 
                'css/index.css', 
                'css/app.css', 
                'css/messenger/messenger.less', 
                'css/perfect.scrollbar/perfect.scrollbar.less', 
                'js/index.js', 
                'js/apps/main.js'
            ],
            manifest: path.join(__dirname, 'compiled-assets')
        }
    },
    production: {
        db: {
            uri: 'mongodb://localhost/listboardit'
        },
        mincer: {
             preprocess: [
                'img/index/**', 
                'font/**', 
                'css/index.css', 
                'css/app.css', 
                'css/messenger/messenger.less', 
                'css/perfect.scrollbar/perfect.scrollbar.less', 
                'js/index.js', 
                'js/apps/main.js'
            ],
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
