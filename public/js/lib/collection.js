var Emitter = require('emitter'),
    _ = require('lodash');

var createCollection = function(modelType) {
    var Collection = function(models) {
        this.models = [];
        this.model = modelType;

        for(var i in models) this.push(models[i]);

        Collection.emit('initialize', this);
    };

    Collection.prototype = {
        constructor: Collection,
        get length() {
            return this.models.length;
        }
    };

    Emitter(Collection);

    for(var key in proto) {
        Collection.prototype[key] = proto[key];
    }

    for(var key in static) {
        Collection[key] = static[key];
    }

    return Collection;
};



var proto = {
    push: function() {
        _.each(arguments, function(model) {
            if(this.model) {
                model = (model instanceof this.model) ? model : (new (this.model)(model));
            }

            this.models.push(model);

            this.constructor.emit('add', this, model);
            this.emit('add', model);
        }, this);

        return this;
    },
    at: function(i) {
        return this.models[i];
    },

    last: function() {
        return this.at(this.length - 1);
    },

    remove: function(index) {
        var model = this.at(index);
        if(model) {
            this.models.splice(index, 1);

            this.constructor.emit('remove', this, model);
            this.emit('remove', model);
        }
        return model;
    }
};

var bind = function(functionName) {
    proto[functionName] = function() {
        return _[functionName].apply(this.models, arguments);
    }
};

var bindThis = function(functionName) {
    proto[functionName] = function() {
        return new (this.constructor)(_[functionName].apply(this.models, arguments));
    }
}

bind('each');
bind('exists');
bind('map');

bindThis('filter');

Emitter(proto);

var static = {
    use: function(fn) {
        fn(this);
        return this;
    }
};

module.exports = createCollection;
