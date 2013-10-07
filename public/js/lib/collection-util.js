var byId = function(Collection) {
    Collection.prototype.byId = function(id) {
        return this._byIdCache[id];
    };

    Collection.prototype.removeById = function(id) {
        var index = this.models.indexOf(this._byIdCache[id]);
        return this.remove(index);
    }

    Collection.on('initialize', function(collection) {
        collection._byIdCache = {};

        collection.on('add', function(model) {
            collection._byIdCache[model._id] = model;
        });

        collection.on('remove', function(model) {
            delete collection._byIdCache[model._id];
        });
    });
};

var capitalize = function(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}

var byFieldCache = function(name) {
    return function(Collection) {
        var cache = '_by_' + name + '_cache';

        Collection.prototype['by' + capitalize(name)] = function(val) {
            return this[cache][val];
        };

        Collection.on('initialize', function(collection) {
            collection[cache] = {};

            collection.on('add', function(model) {
                collection[cache][model[name]] = model;
            });

            collection.on('remove', function(model) {
                delete collection[cache][model[name]];
            });
        });
    }
};

module.exports = {
    byId: byId,
    byFieldCache: byFieldCache
};