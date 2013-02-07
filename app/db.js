var config = require('../config/config');

module.exports = function () {

  console.log("Initializing database");

  return require('mongoose').connect(config.db.uri);
}