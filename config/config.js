var environment = process.env.NODE_ENV || 'development';

var _ = require('lodash'),
    path = require('path');

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
        facebook: {
            appId: "147484312059729", appSecret: "632b8055f1824abb1b8920569a53ec3d", callbackURL: "http://localhost:4000/auth/facebook/callback"
        },
        twitter: {
            consumerKey: "3VUr5nN4JlQIDAO4uTUz6w", consumerSecret: "BsTli6tyipxarjfbbTdgIg2pZuaLTSYAkQm5LETwJs", callbackURL: "http://localhost:4000/auth/twitter/callback"
        },
        google: {
            clientID: "1086393338414.apps.googleusercontent.com", clientSecret: "tFZatA6ZOzL6qkgBEBOx55ab", callbackURL: "http://localhost:4000/auth/google/callback"
        },
        mincer: {
            url: '/public',
            roots: './public'
        },
        'socket-io': {}
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
        },
        precompiledAssets: ['img/index/**', 'font/**', 'css/index.css', 'js/apps/index.js'],
        'socket-io': {}
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
        },
        precompiledAssets: ['img/index/**', 'font/**', 'css/index.css', 'js/apps/index.js'],
        'socket-io': {}
    }
};

Object.keys(config).forEach(function (key) {
    config[key]["connect-mongo"] = {
        auto_reconnect: true,
        collection: 'sessions',
        url: config[key].db.uri
    }
});

config[environment].env = environment;

module.exports = config[environment];
