/* jshint node: true */

var _ = require('lodash'),
  Item = require('../../models/item'),
  responses = require('../responses'),
  errors = require('../errors'),

  Promise = require('bluebird');

var navigate = require('../browser/main').navigate;

var file = require('../../util/file');

var userUpdate = require('./user_update');

//Add item
exports.addItem = function (req, res) {
  req.check('url').notEmpty();

  var errs = req.validationErrors();
  if (errs) return errors.sendBadRequest(res);

  var item = new Item(_.pick(req.body, 'title', 'url'));
  item.user = req.user._id;

  return item.saveWithPromise()
    .then(responses.sendModelId(res, item._id), errors.ifErrorSendBadRequest(res))
    .then(userUpdate.createItem.bind(null, req.user._id, item))
    .then(function () {
      if (item.url) {
        return navigate({
          url: item.url,
          item: item,
          languages: req.user.langs
        });
      }
    });
}


//Update item
exports.update = function (req, res) {
  var item = req.currentItem;

  _.assign(item, _.pick(req.body, 'title', 'scrollX', 'scrollY', 'deleted', 'tags'));

  if(req.body.tags) item.markModified('tags');

  return item.saveWithPromise()
    .then(responses.sendModelId(res, item._id), errors.ifErrorSendBadRequest(res))
    .then(userUpdate.updateItem.bind(null, req.user._id, item))
}

//Search item
exports.search = function (req, res) {
  Item.textSearch(req.query, function (err, output) {

    if (err) return errors.sendInternalServer(res);

    var ids = output.results.map(function (result) {
      return result.obj._id;
    })

    res.json({ query: req.query, items: ids });
  });
}

//Remove item
exports.delete = function (req, res) {
  var item = req.currentItem;
  return item.removeWithPromise()
    .then(function () {
      if (item.parent) removeItemFromParent(item, item.parent, req, res)
    })
    .then(userUpdate.deleteItem.bind(null, req.user._id, item))
    .then(responses.sendModelId(res, item._id), errors.ifErrorSendBadRequest(res))
    .then(function () {
      if (req.path && item.files.length > 0) {
        return Promise.all(item.files.map(function (f) {
          return file.remove(f.name);
        }))
      }
    })
}

//Find item by id
exports.item = function (req, res, next, id) {
  if (req.isAuthenticated()) {
    return Item.by({ _id: id, user: req.user })
      .then(function (item) {
        if (!item) return errors.sendNotFound(res);

        req.currentItem = item;
        next();
      }, next);
  } else {
    res.send(401);
  }
}

exports.query = function (req, res, next, query) {
  req.query = query;
  next();
};

exports.get = function (req, res, next) {
  var mongoSearch = { user: req.user._id, deleted: false };

  if (req.query.with) {
    var w = req.query.with;
    mongoSearch.tags = mongoSearch.tags || {};
    mongoSearch.tags.$all = Array.isArray(w) ? w: [w] ;
  }

  if(req.query.without) {
    var without = req.query.without;
    mongoSearch.tags = mongoSearch.tags || {};
    mongoSearch.tags.$nin = Array.isArray(without) ? without: [without] ;
  }

  return Item.all(mongoSearch).then(function (items) {
    res.json(items);
  })
};