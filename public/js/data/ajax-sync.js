var send = require('../send');

var util = require('moco/lib/util');

var encode = encodeURIComponent;

function queryString(query) {
  return Object.keys(query)
    .reduce(function (q, key) {
      var value = query[key];
      if (Array.isArray(value)) {
        value.forEach(function (value) {
          q.push(encode(key) + '=' + encode(value));
        });
      } else {
        q.push(encode(key) + '=' + encode(value));
      }
      return q;
    }, [])
    .join('&');
}

module.exports = function (baseUrl, urlOverrides) {
//json headers
  var headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };

  var urlMap = {
    create: '',
    list: '',
    read: '/:primary',
    remove: '/:primary',
    removeAll: '',
    update: '/:primary'
  };

  Object.keys(urlOverrides || {}).forEach(function (k) {
    urlMap[k] = urlOverrides[k];
  });

  function urlForAction(action) {
    var url = urlMap[action];

    var that = this;
    url = url.replace(/:(\w+)/g, function (match, word) {
      if (word in that.constructor.attributes || word == 'primary') {
        return that[word];
      }
      return match;
    });

    return baseUrl + url;
  }

  return {
    model: function (Model) {
      Model.where = function (queryObj) {
        var qs = queryString(queryObj || {});
        var url = urlForAction.call(this, 'read') + (qs != '' ? '?' + qs : '');
        return send({ method: 'GET', headers: headers, url: url })
          .spread(function (response, status) {
            if (status == 200) {
              var model = new Model(JSON.parse(response));
              model.sync.persisted = true;
              return model;
            }
          })
      };

      Model.prototype.save = function () {
        var that = this, url;
        if (this.isNew()) {
          url = urlForAction.call(this, 'create');
          return send({ method: 'POST', headers: headers, url: url, data: JSON.stringify(that) })
            .spread(function (response, status) {
              var obj = JSON.parse(response);
              that.set(obj);
              that.sync.persisted = true;
              that.sync.dirty = false;
              return that;
            });
        } else if (this.isDirty()) {
          url = urlForAction.call(this, 'update');
          return send({ method: 'PUT', headers: headers, url: url, data: JSON.stringify(that.sync.delta) })
            .then(function () {
              that.sync.dirty = false;
              that.sync.delta = {};
              return that;
            })
        }
      };

      Model.prototype.remove = function () {
        var that = this;
        var url = urlForAction.call(this, 'remove');
        return send({ method: 'DELETE', url: url })
          .then(function () {
            that.sync.persisted = false;
            that.sync.dirty = true;
            return that;
          });
      };

      Model.prototype.isNew = function () {
        return !this.sync.persisted;
      };

      Model.prototype.isDirty = function () {
        return this.sync.dirty;
      };

      Model.prototype.setSynced = function() {
        this.sync.persisted = true;
        this.sync.dirty = false;
        this.sync.delta = {};
        this.sync.changes = {};
      };

      Model.on('initialize', function (model) {
        Object.defineProperty(model, 'sync', {
          value: {
            persisted: false,
            dirty: true,
            delta: {},
            changes: {}
          },
          enumerable: false
        });

        model.on('change', function (path, value, prevValue) {
          if (path in Model.attributes) {
            if(util.isCollectionAttribute(Model.attributes[path])) {
              doChange(this, path, value, prevValue, true);
            } else {
              doChange(this, path, value, prevValue);
            }
          }
        });
      });

      function doChange(model, path, value, prevValue, force) {
        // we do not need changes of new model
        if (model.isNew()) return;

        // if value unchanged, but we want to force change
        if (value === prevValue && !force) return;

        // save original value for avoid unnessesary saves
        var changes = model.sync.changes;
        var delta = model.sync.delta;
        // if we first time change this path
        if (!(path in changes)) {
          changes[path] = prevValue;
          //if we change path to original value
        } else if (changes[path] === value) {

          // if value was previously in $set object (to save in mongo) remove it and remove $set if it is empty
          if (path in delta) {
            delete delta[path];
          }

          // if no more changes, set the object not dirty
          if (Object.keys(delta).length == 0) {
            model.sync.dirty = false;
          }
          return;
        }

        model.sync.dirty = true;

        //if we delete value
        if (typeof value == 'undefined') {
          delta[path] = null;
        } else {
          var attributeOptions = Model.attributes[path];
          if (attributeOptions.type && value != null && value.toJSON) {
            delta[path] = value.toJSON();
          } else {
            delta[path] = value;
          }


        }
      }

      Model.prototype.markModified = function (path) {
        if (path in Model.attributes) {
          var value = this[path];
          doChange(this, path, value, value, true);
        }
      };

    },

    collection: function (Collection) {
      Collection.where = function (queryObj) {
        var qs = queryString(queryObj || {});
        var url = urlForAction.call(this, 'list') + (qs != '' ? '?' + qs : '');
        return send({ method: 'GET', headers: headers, url: url })
          .spread(function (response, status) {
            var arr = JSON.parse(response);

            arr = new Collection(arr);

            return arr;
          });
      };
    }
  }
}