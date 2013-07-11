var environment = process.env.NODE_ENV || 'development';

var _ = require('lodash');

var config = {
    test: {
        db: {
            uri: 'mongodb://localhost/listboardit-test'
        }
    },
    development: {
        db: {
            uri: 'mongodb://localhost/listboardit'
        }, facebook: {
            appId: "147484312059729", appSecret: "632b8055f1824abb1b8920569a53ec3d", callbackURL: "http://localhost:4000/auth/facebook/callback"
        }, twitter: {
            consumerKey: "3VUr5nN4JlQIDAO4uTUz6w", consumerSecret: "BsTli6tyipxarjfbbTdgIg2pZuaLTSYAkQm5LETwJs", callbackURL: "http://localhost:4000/auth/twitter/callback"
        }, google: {
            clientID: "1086393338414.apps.googleusercontent.com", clientSecret: "tFZatA6ZOzL6qkgBEBOx55ab", callbackURL: "http://localhost:4000/auth/google/callback"
        }
    }, production: {
        db: {
            uri: 'mongodb://localhost/listboardit'
        }
    }
};

Object.keys(config).forEach(function (key) {
    config[key]["connect-mongo"] = {
        auto_reconnect: true,
        collection: 'sessions',
        url: config[key].db.uri
    }
});

module.exports = config[environment];
