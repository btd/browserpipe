var _ = require('lodash'),
    Emitter = require('emitter');

var Model = function(attributes) {

    Object.defineProperty(this, 'attributes', {
        value: {},
        enumerable: false
    })

    //_.extend(this, attributes);
    _.each(attributes, function(value, key) {
        this.attributes[key] = value;
        Object.defineProperty(this, key, {
            get: function() { return attributes[key]; },
            set: function(value) {
                attributes[key] = value;
            },
            enumerable: true
        })
    }, this);

    //TODO add check that attributes have required properties
}

module.exports = Model;
