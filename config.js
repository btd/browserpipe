var environment = process.env.NODE_ENV || 'development';

var _ = require('lodash');

var common = {
  session: {
    cookie: {
      name: 'bp.sid',
      secret: 'd5bSD5N0dl3Vs1SwXw6pMkxS'
    }
  },
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
    thumbnailWidth: 300
  },
  'socket-io': {
    userUpdateRedisKeyPrefix: 'user_update:',
    'log level': 1
  },
  redis: {
    host: '127.0.0.1',
    port: 6379
  },

  userLimit: 2147483648 // 2gb in bytes
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
    }
  },
  production: {
    appUrl: 'https://browserpipe.com',
    db: {
      uri: 'mongodb://localhost/listboardit'
    }
  }
};

Object.keys(config).forEach(function(key) {
  config[key] = _.merge({}, common, config[key]);

  config[key].env = key;
});

module.exports = config[environment];
