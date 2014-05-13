/* jshint node: true */

var _ = require('lodash'),
  Item = require('../../models/item'),
  responses = require('../responses'),
  errors = require('../errors'),

  Promise = require('bluebird');

var userUpdate = require('./user_update');

//Add item
exports.addItemToBrowser = function(req, res) {
  req.check('type').isInt();
  req.check('browserParent').notEmpty();

  var errs = req.validationErrors();
  if(errs) return errors.sendBadRequest(res);

  var updateBrowser = false;
  var parent = req.currentItem;
  var item = new Item(_.pick(req.body, 'type', 'title', 'url', 'previous'));
  //We set the parent in the browser;
  item.browserParent = parent._id;
  item.user = req.user._id;
  //If parent is not in browser is not the browser root, we move it to browser;
  //This is to show from where there item comes from
  if(!parent.browserParent && parent._id !== req.user.browser) {
    parent.browserParent = req.user.browser;
    updateBrowser = true;
  }

  //Add item to parent, if it has a previous we put it in the same position
  if(item.previous) {
    var index = parent.items.indexOf(item.previous);
    if(index >= 0) parent.items[index] = item._id;
    else parent.items.push(item._id);
  }
  else
    parent.items.push(item._id);
  parent.markModified('items');


  parent.saveWithPromise()
    .then(function() {
        if(updateBrowser)
          return appendItemToParent(parent, req.user.browser, req, res);
    })
    .then(function() {
      if(item.previous)
        return Item.byId({ _id: item.previous })
          .then(function(previous) {
            previous.next = item._id;
            return previous.saveWithPromise().then(userUpdate.updateItem.bind(null, req.user._id, previous));
          })
    })
    .then(function() {
      item.saveWithPromise()
        .then(responses.sendModelId(res, item._id), errors.ifErrorSendBadRequest(res))
        .then(userUpdate.createItem.bind(null, req.user._id, item))
        .then(userUpdate.updateItem.bind(null, req.user._id, parent));
    });
}

exports.addItemToArchive = function(req, res) {
  req.check('type').isInt();

  var errs = req.validationErrors();
  if(errs) return errors.sendBadRequest(res);

  var parent = req.currentItem;
  var item = new Item(_.pick(req.body, 'type', 'title', 'url', 'previous'));
  item.archiveParent = parent._id;
  item.user = req.user._id;
  parent.items.push(item._id);
  parent.markModified('items');

  parent.saveWithPromise()
    .then(function() {
      item.saveWithPromise()
        .then(responses.sendModelId(res, item._id), errors.ifErrorSendBadRequest(res))
        .then(userUpdate.createItem.bind(null, req.user._id, item))
        .then(userUpdate.updateItem.bind(null, req.user._id, parent));
    });
}

var switchBrowserParentItems = function(oldItemId, newItem, req, res) {
  return Item.byId({ _id: oldItemId })
    .then(function(oldItem) {
      newItem.browserParent = oldItem.browserParent ? oldItem.browserParent : req.user.browser;
      oldItem.browserParent = null; //We hide old item from browser
      return oldItem.saveWithPromise()
        .then(userUpdate.updateItem.bind(null, req.user._id, oldItem))
    })
    .then(function() {
      Item.byId({ _id: newItem.browserParent })
        .then(function(browserParent) {
          var index = browserParent.items.indexOf(oldItemId);
          if(index >= 0) {
            browserParent.items.remove(oldItemId);
            browserParent.items[index] = newItem._id;
          }
          else browserParent.items.push(newItem._id);
          browserParent.markModified('items');
          return browserParent.saveWithPromise()
            .then(userUpdate.updateItem.bind(null, req.user._id, browserParent));
        })
    })
    .then(function() {
      newItem.saveWithPromise()
        .then(userUpdate.updateItem.bind(null, req.user._id, newItem));
    })
}

var appendItemToParent = function(item, parentId, req, res) {
  return Item.byId({ _id: parentId })
    .then(function(parent) {
      if(parent.items.indexOf(item._id) === -1) {
        parent.items.push(item._id);
        parent.markModified('items');
        return parent.saveWithPromise()
          .then(userUpdate.updateItem.bind(null, req.user._id, parent));
      }
    })
}

var removeItemToParent = function(item, parentId, req, res) {
  return Item.byId({ _id: parentId })
    .then(function(parent) {
      if(parent.items.indexOf(item._id) > -1) {
        parent.items.remove(item._id);
        parent.markModified('items');
        return parent.saveWithPromise()
          .then(userUpdate.updateItem.bind(null, req.user._id, parent));
      }
    })
}

//Move item
exports.moveItemToBrowser = function(req, res) {
  var item = req.currentItem;
  if(req.body.isPrevious && item.next) //If navigating back, we update also next
    return switchBrowserParentItems(item.next, item, req, res)
             .then(responses.sendModelId(res, item._id), errors.ifErrorSendBadRequest(res));
  else if(req.body.isNext && item.previous) //If navigating forward, we update also previous
    return switchBrowserParentItems(item.previous, item, req, res)
             .then(responses.sendModelId(res, item._id), errors.ifErrorSendBadRequest(res));
  else {
    var oldParent = item.browserParent;
    item.browserParent = req.user.browser;
    return item.saveWithPromise()
      .then(function() { if(oldParent) removeItemToParent(item, oldParent, req, res) })
      .then(function() { appendItemToParent(item, item.browserParent, req, res) })
      .then(userUpdate.updateItem.bind(null, req.user._id, item))
      .then(responses.sendModelId(res, item._id), errors.ifErrorSendBadRequest(res));
  }
}

exports.moveItemToArchive = function(req, res) {
  req.check('parent').notEmpty();

  var errs = req.validationErrors();
  if(errs) return errors.sendBadRequest(res);

  var item = req.currentItem;
  var oldParent = item.archiveParent;
  item.archiveParent = req.body.parent;
  return item.saveWithPromise()
    .then(function() { if(oldParent) removeItemToParent(item, oldParent, req, res) })
    .then(function() { appendItemToParent(item, item.archiveParent, req, res) })
    .then(userUpdate.updateItem.bind(null, req.user._id, item))
    .then(responses.sendModelId(res, item._id), errors.ifErrorSendBadRequest(res));
}

//Remove item
exports.removeItemFromBrowser = function(req, res) {
  var item = req.currentItem;
  var browserParentId = item.browserParent;
  item.browserParent = undefined;
  return removeItem(item, browserParentId, req, res);
}

exports.removeItemFromArchive = function(req, res) {
  var item = req.currentItem;
  var archiveParentId = item.archiveParent;
  item.archiveParent = undefined;
  return removeItem(item, archiveParentId, req, res);
}

var removeItem = function(item, parentId, req, res) {
  return Item.byId({ _id: parentId })
    .then(function(parent) { //Updates parent
      parent.items.remove(item._id);
      parent.markModified('items');
      return parent.saveWithPromise().then(userUpdate.updateItem.bind(null, req.user._id, parent));
    })
    .then(function() { //Update item
      item.saveWithPromise()
        .then(responses.sendModelId(res, item._id), errors.ifErrorSendBadRequest(res))
        .then(userUpdate.updateItem.bind(null, req.user._id, item))
    })
}

exports.addItemBookmarklet = function(req, res) {
/*  req.check('url').notEmpty();

  var errs = req.validationErrors();
  if(errs) return errors.sendBadRequest(res);

  var redirect = 'back';

  var query = req.query;
  if(query.next === 'same') {
    redirect = query.url;
  }

  return Item.by({ _id: query.to || req.user.laterListboard, user: req.user._id }).then(function(parent) {
    if(parent) {
      var item = parent.addBookmark(_.pick(query, 'title', 'url'));

      return item.saveWithPromise()
        .then(function() {
          return parent.saveWithPromise();
        })
        .then(function() {
          res.redirect(redirect);
        })
        .then(userUpdate.createItem.bind(null, req.user._id, item))
        .then(userUpdate.updateItem.bind(null, req.user._id, parent))
    } else {
      res.redirect(redirect);
    }
  })*/
}

//Update item
exports.update = function(req, res) {
  var item = req.currentItem;

  _.merge(item, _.pick(req.body, 'parent', 'title', 'items', 'scrollX', 'scrollY'));
  if(req.body.items)
    item.markModified('items');

  return item.saveWithPromise()
    .then(responses.sendModelId(res, item._id), errors.ifErrorSendBadRequest(res))
    .then(userUpdate.updateItem.bind(null, req.user._id, item))
}

//Find item by id
exports.item = function(req, res, next, id) {
  return Item.by({ _id: id, user: req.user })
    .then(function(item) {
      if(!item) return errors.sendNotFound(res);

      req.currentItem = item;
      next();
    }, next);
}

//Remove item
exports.delete = function(req, res) {
  //TODO: fully delete item
}

exports.query = function(req, res, next, query) {
  req.query = query;
  next();
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

