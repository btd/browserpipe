var environment = process.env.NODE_ENV || 'development';

var _ = require('lodash'),
  path = require('path');

var common = {
  cookieSecret: 'd5bSD5N0dl3Vs1SwXw6pMkxS',
  storage: {
    path: './public/storage',
    url: '/public/storage',
    pathConfig: [2, 2, 2, 2]//it is number of bits used in chunks for sub folders like AAAA/BBBB/CCCC/DDDD
  },
  screenshot: {
    extension: '.jpg',
    viewportSize: {
      width: 1280,
      height: 1024
    },
    thumbnailWidth: 260
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
    appUrl: 'https://browserpipe.com',
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
  config[key] = _.merge({}, common, config[key]);

  config[key]["connect-mongo"] = {
    auto_reconnect: true,
    collection: 'sessions',
    url: config[key].db.uri
  };

  config[key].env = key;
});

module.exports = config[environment];
