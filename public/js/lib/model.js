var _ = require('lodash'),
    Emitter = require('emitter');

var isGetter = function(attributeOptions) {
    return typeof attributeOptions.get === 'function';
}

var createModel = function(modelOptions) {
    var Model = function(attributes) {
        Object.defineProperties(this, {
            attributes: { //where we store attibute values
                value: {},
                enumerable: false
            },
            _callbacks: { //for event emmitter
                value: {},
                enumerable: false
            }
        });

        // set default values and assign
        _.each(this.constructor.attributes, function(attributeOptions, name) {

            // define getter/setter
            if(isGetter(attributeOptions)) {
                //it is getter
                Object.defineProperty(this, name, {
                    get: attributeOptions.get,
                    enumerable: false
                });
            } else {

                // let define for our model getter and setter that it mimic real plain object
                Object.defineProperty(this, name, {
                    // this.attributes added in constructor
                    get: function() {
                        return this.attributes[name];
                    },
                    set: function(value) {
                        /*
                         For primitive types it will compare by value, but for reference types by reference
                         as a TODO:
                         1. add support of standard types: Date, RegExp
                         2. add support of collections and models (with eventing)
                         */
                        var changed = this.attributes[name] !== value;

                        if(changed) {
                            var prev = this.attributes[name];
                            this.attributes[name] = value;

                            this.constructor.emit('change', this, name, value, prev);
                            this.constructor.emit('change:' + name, this, value, prev);
                            this.emit('change', name, value, prev);
                            this.emit('change:' + name, value, prev);
                        }
                    },
                    enumerable: true
                })
            }
            //we take from attributes only defined keys

            var defaultValue = attributeOptions.default;

            // only if attribute undefined we set default value
            this.attributes[name] = attributes[name] === undefined ?
                typeof defaultValue === 'function' ?
                    defaultValue.call(this) :
                    defaultValue :
                attributes[name];
        }, this);

        Model.emit('initialize', this);
    }

    Model.prototype = {
        constructor: Model,
        isNew: function() {
            var key = this.constructor.primaryKey;
            return key && !!this[key];
        }
    }

    Emitter(Model.prototype); // each instance will can emit events
    Emitter(Model); // but also constructor can emit events for all models

    // static properties
    Model.options = modelOptions || {};
    Model.attributes = {}; // where we store defined attributes and their properties
    Model.primaryKey = false; //by default it is a name of attribute that

    /*
        Possible attribute options:
        primary {Boolean} by default is false, - fill primaryKey, make working isNew
        get {Function} by default is false - make this attribute getter
        default {Function|value} by default is undefined - default value for this attribute, assigned with default value while creation
     */
    Model.attr = function(name, attributeOptions) {
        //NB `this` there it is Model not instance
        if(!this.attributes[name]) { //we do not have this attribute
            attributeOptions = _.defaults(attributeOptions || {}, {
                get: false,
                default: undefined,
                primary: false
            });

            // there we can add validators
            // TODO validate by types, values (numbers, strings etc)

            this.attributes[name] = attributeOptions;

            if(attributeOptions.primary) {
                if(this.primaryKey) throw new Error('Set 2 primary keys');
                this.primaryKey = name;
            }


        }
        return this;
    }

    Model.use = function(fn){
        fn(this);
        return this;
    };

    return Model;
}

module.exports = createModel;
