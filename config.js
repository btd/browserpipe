var environment = process.env.NODE_ENV || 'development';

var _ = require('lodash'),
  path = require('path');

var common = {
  cookieSecret: 'd5bSD5N0dl3Vs1SwXw6pMkxS',
  storage: {
    path: './public/storage',
    url: '/storage'
  },
  screenshot: { // default screenshot settings
    format: 'png',
    width: 800,
    height: 600
  },
  'socket-io': {
    userUpdateRedisKeyPrefix: 'user_update:',
    'log level': 1
  },
  redis: {
    host: '127.0.0.1',
    port: 6379,
    options: {}
  },
  mincer: {
    url: '/public',
    roots: './public'
  }
};

var config = {
  test: {
    db: {
      uri: 'mongodb://localhost/listboardit-test'
    }
  },
  development: {
    appUrl: 'http://localhost:4000',
    db: {
      uri: 'mongodb://localhost/listboardit-dev'
    }
  },
  staging: {
    appUrl: 'http://000staging.listboard.it',
    db: {
      uri: 'mongodb://localhost/listboardit-stage'
    },
    mincer: {
      preprocess: [
        'img/index/**',
        'font/**',
        'css/index.css',
        'css/app.css',
        'js/index.js',
        'js/apps/main.js'
      ],
      manifest: path.join(__dirname, 'compiled-assets')
    }
  },
  production: {
    appUrl: 'http://listboard.it',
    db: {
      uri: 'mongodb://localhost/listboardit'
    },
    mincer: {
      preprocess: [
        'font/**',
        'img/**',
        'js/index.js',
        'js/apps/main.js',
        'css/index.css',
        'css/app.css'
      ],
      manifest: path.join(__dirname, 'compiled-assets')
    }
  }
};

Object.keys(config).forEach(function(key) {
  config[key] = _.merge(config[key], common);

  config[key]["connect-mongo"] = {
    auto_reconnect: true,
    collection: 'sessions',
    url: config[key].db.uri
  }

  config[key].env = key;
});

module.exports = config[environment];
