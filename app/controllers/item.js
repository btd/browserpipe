/* jshint node: true */

var _ = require('lodash'),
    Item = require('../../models/item'),
    StorageItem = require('../../models/storage-item'),
    responses = require('../responses'),
    errors = require('../errors'),

    Promise = require('bluebird');

var userUpdate = require('./user_update');


exports.addItemToItem = function(parent, req, res) {
    var item = new Item(_.pick(req.body, 'type', 'title', 'url', 'previous'));
    item.parent = parent._id;
    item.user = req.user._id;

    return Promise.cast(item.save())
        .then(function() {
	    if(item.previous){
	      var index = parent.items.indexOf(item.previous);
	      if(index >= 0) parent.items[index] = item._id;
	      else parent.items.push(item._id);
	    }
	    else
              parent.items.push(item._id);
            parent.markModified('items'); 
            return Promise.cast(parent.save());
        })
        .then(function() {
	  if(item.previous)
	    return Item.byId({ _id: item.previous })
	      .then(function(previous) {
		previous.next = item._id;
                return Promise.cast(previous.save()).then(userUpdate.updateItem.bind(null, req.user._id, previous));
              })
        })
        .then(responses.sendModelId(res, item._id), errors.ifErrorSendBadRequest(res))
        .then(userUpdate.createItem.bind(null, req.user._id, item))
        .then(userUpdate.updateItem.bind(null, req.user._id, parent));
};

// this method used to add item to another item (because item could not exists without any parent container)
exports.addToItem = function(req, res) {
    req.check('type').isInt();
    req.check('parent').notEmpty();

    var errs = req.validationErrors();
    if (errs) return errors.sendBadRequest(res);

    return exports.addItemToItem(req.currentItem, req, res);
};

exports.addItemBookmarklet = function(req, res) {
    req.check('url').notEmpty();

    var errs = req.validationErrors();
    if (errs) return errors.sendBadRequest(res);

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
                .then(function(){
                    res.redirect(redirect);
                })
                .then(userUpdate.createItem.bind(null, req.user._id, item))
                .then(userUpdate.updateItem.bind(null, req.user._id, parent))
                .then(function() {
                    if(item.isBookmark()) {

                    }
                });
        } else {
            res.redirect(redirect);
        }
    })
}

//Update item
exports.update = function(req, res) {
    var item = req.currentItem;    
    _.merge(item, _.pick(req.body, 'title', 'items', 'scrollX', 'scrollY'));// for now only title and items can be changed, by idea will need to add url and note depending from type of item
    if(req.body.items)
     item.markModified('items'); 

    return Promise.cast(item.save())
        .then(responses.sendModelId(res, item._id), errors.ifErrorSendBadRequest(res))
        .then(userUpdate.updateItem.bind(null, req.user._id, item))
}

//Find item by id
exports.item = function(req, res, next, id) {
    return Item.by({ _id: id, user: req.user })
        .then(function(item) {
            if (!item) return errors.sendNotFound(res);

            req.currentItem = item;
            next();
        }, next);
}

//TODO need to send updates to client
function removeItem(item) {
    return Item.all({ _id: { $in: item.items } }).then(function(items) {
        return Promise.all(items.map(removeItem));
    }).then(function() {
        item.deleted = true;
        return item.save();
    });
}

//Remove item
exports.delete = function(req, res) {
    var item = req.currentItem;

    //1 delete parent reference
    if(item.parent) { //simple item
        return Item.byId({ _id: item.parent })
            .then(function(parent) {
                parent.items.remove(item._id);
                return Promise.cast(parent.save()).then(userUpdate.updateItem.bind(null, req.user._id, parent));
            })
            .then(responses.sendModelId(res, item._id), errors.ifErrorSendBadRequest(res))
            .then(removeItem.bind(null, item))//2 delete item
    } else {//root item - should be listboard
        errors.sendForbidden(res);
    }
}

exports.query = function(req, res, next, query) {
    req.query = query;
    next();
}


//Search item
exports.search = function(req, res) {
    Item.textSearch(req.query, function (err, output) {
        
        if (err) return errors.sendInternalServer(res);

        var ids = output.results.map(function(result) {
            return result.obj._id;
        })

        res.json({ query: req.query, items: ids });
    });
}

exports.storageItem = function(req, res) {


  var storageId = req.params['storageId'];

  return StorageItem.by({ _id: storageId }).then(function(si) {
    if(si) {
      return si.getContent().then(function(content) {
        if(si.contentType) {
          res.header('Content-Type', si.contentType);
        }
        if(si.contentLength) {
          res.header('Content-Length', si.contentLength);
        }

        res.send(content);
      })
    } else {
      res.send(404, 'Not found');
    }
  })
}
