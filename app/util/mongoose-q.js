var mongoose = require('mongoose'),
    Q = require('q'),
    _ = require('lodash');

var QueryMethogs = ['exec'];
var ModelMethods = ['save', 'remove'];

var suffix = 'WithPromise';

var array_slice = Array.prototype.slice;

var patchMethods = function(proto, methods) {
    methods.forEach(function(methodName) {
        if(_.isFunction(proto[methodName])) {
            proto[methodName + suffix] = function() {
                var deferred = Q.defer();
                var args = array_slice(arguments);
                args.push(deferred.makeNodeResolver());
                this[methodName].apply(this, args);
                return deferred.promise;
            };
        }
    });
};

patchMethods(mongoose.Query.prototype, QueryMethogs);
patchMethods(mongoose.Model.prototype, ModelMethods);


module.exports = mongoose;