var mongoose = require('mongoose');
var Promise = require('bluebird');

module.exports = function(Schema) {
  Schema.method('saveWithPromise', function() {
    var that = this;
    return new Promise(function (resolve, reject) {
      that.save(function (err, product, numberAffected) {
        if (err) return reject(err);

        resolve([product, numberAffected]);
      })
    })
  })
};