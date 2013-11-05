var Q = require('q'),
    crypto = require('crypto');


module.exports.generateRandomString = function(bits) {
    bits = bits || 256;

    var deferred = Q.defer();
    crypto.randomBytes(bits, function (ex, buffer) {
        if (ex) return deferred.reject(ex);

        deferred.resolve(crypto.createHash('sha512').update(buffer).digest('hex'));
    });
    return deferred.promise;
}