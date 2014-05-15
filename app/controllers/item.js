/* jshint node: true */

var _ = require('lodash'),
  Item = require('../../models/item'),
  responses = require('../responses'),
  errors = require('../errors'),

  Promise = require('bluebird');

var userUpdate = require('./user_update');

//Add item
exports.addItem = function(req, res) {
  req.check('type').isInt();

  var errs = req.validationErrors();
  if(errs) return errors.sendBadRequest(res);

  var parent = req.currentItem;
  var item = new Item(_.pick(req.body, 'type', 'title', 'url'));
  item.parent = parent._id;
  item.user = req.user._id;
  parent.items.push(item._id);

  parent.saveWithPromise()
    .then(function() {
      item.saveWithPromise()
        .then(responses.sendModelId(res, item._id), errors.ifErrorSendBadRequest(res))
        .then(userUpdate.createItem.bind(null, req.user._id, item))
        .then(userUpdate.updateItem.bind(null, req.user._id, parent));
    });
}

//Move item
exports.moveItem = function(req, res) {
  req.check('parent').notEmpty();

  var errs = req.validationErrors();
  if(errs) return errors.sendBadRequest(res);

  var item = req.currentItem;
  if(item.deleted) //We also restore items by moving it to a folder from trash
    item.deleted = false;
  var oldParent = item.parent;
  item.parent = req.body.parent;
  return item.saveWithPromise()
    .then(function() { if(oldParent) removeItemFromParent(item, oldParent, req, res) })
    .then(function() { appendItemToParent(item, item.parent, req, res) })
    .then(userUpdate.updateItem.bind(null, req.user._id, item))
    .then(responses.sendModelId(res, item._id), errors.ifErrorSendBadRequest(res));
}

//Update item
exports.update = function(req, res) {
  var item = req.currentItem;

  _.merge(item, _.pick(req.body, 'parent', 'title', 'items', 'scrollX', 'scrollY', 'deleted'));

  return item.saveWithPromise()
    .then(function() { if(req.body.deleted) removeItemFromParent(item, item.parent, req, res); })
    .then(responses.sendModelId(res, item._id), errors.ifErrorSendBadRequest(res))
    .then(userUpdate.updateItem.bind(null, req.user._id, item))
}

//Search item
exports.search = function(req, res) {
  Item.textSearch(req.query, function(err, output) {

    if(err) return errors.sendInternalServer(res);

    var ids = output.results.map(function(result) {
      return result.obj._id;
    })

    res.json({ query: req.query, items: ids });
  });
}

//Remove item
exports.delete = function(req, res) {
  //TODO: fully delete item from db
  /*var item = req.currentItem;
  return item.deleteWithPromise()
    .then(function() { if(item.parent) removeItemToParent(item, item.parent, req, res) })
    .then(userUpdate.deleteItem.bind(null, req.user._id, item))
    .then(responses.sendModelId(res, item._id), errors.ifErrorSendBadRequest(res));*/
}

//Find item by id
exports.item = function(req, res, next, id) {
  if(req.isAuthenticated()) {
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

exports.query = function(req, res, next, query) {
  req.query = query;
  next();
}

var appendItemToParent = function(item, parentId, req, res) {
  return Item.byId({ _id: parentId })
    .then(function(parent) {
      if(parent.items.indexOf(item._id) === -1) {
        parent.items.push(item._id);
        return parent.saveWithPromise()
          .then(userUpdate.updateItem.bind(null, req.user._id, parent));
      }
    })
}

var removeItemFromParent = function(item, parentId, req, res) {
  return Item.byId({ _id: parentId })
    .then(function(parent) {
      if(parent.items.indexOf(item._id) > -1) {
        parent.items.remove(item._id);
        return parent.saveWithPromise()
          .then(userUpdate.updateItem.bind(null, req.user._id, parent));
      }
    })
}

