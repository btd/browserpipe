var Emitter = require('emitter'),
    _ = require('lodash');

var createCollection = function(modelType) {

    var Collection = function(models) {
        Object.defineProperties(this, {
            _callbacks: { //for event emmitter
                value: {},
                enumerable: false
            }
        });

        this.length = 0; //weird thing that i could not make length not enumerable =(

        for(var i in models) this.push(models[i]);

        Collection.emit('initialize', this);
    };

    Collection.model = modelType;

    Collection.prototype = {
        constructor: Collection
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

var aPush = Array.prototype.push;
var aSplice = Array.prototype.splice;
var aSlice = Array.prototype.slice;

var proto = {
    indexOf: Array.prototype.indexOf,
    push: function() {
        _.each(arguments, function(model) {
            if(this.constructor.model) {
                model = (model instanceof this.constructor.model) ? model : (new (this.constructor.model)(model));
            }

            aPush.call(this, model);

            this.constructor.emit('add', this, model);
            this.emit('add', model);
        }, this);

        return this;
    },

    last: function() {
        return this[this.length - 1];
    },

    remove: function(index) {
        var model = this[index];
        if(model) {

            aSplice.call(this, index, 1);

            this.constructor.emit('remove', this, model);
            this.emit('remove', model);
        }
        return model;
    },

    toJSON: function() {
        return aSlice.call(this); //let it think that we are array =)
    }
};

//small evristic i know that each method in _ do not have more then 4 arguments
var bind = function(functionName) {
    proto[functionName] = function() {
        return _[functionName].call(null, this, arguments[0], arguments[1], arguments[2], arguments[3]);
    }
};

var bindThis = function(functionName) {
    proto[functionName] = function() {
        return new (this.constructor)(_[functionName].call(null, this, arguments[0], arguments[1], arguments[2], arguments[3]));
    }
}

bind('each');
bind('some');
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
