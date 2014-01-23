/* jshint node: true */

var _ = require('lodash'),
    config = require('../../config'),
    Item = require('../../models/item'),
    responses = require('../responses'),
    errors = require('../errors'),

    Q = require('q'),

    jobs = new (require('../../jobs/manager'));

var userUpdate = require('./user_update');

function launchItemJobs(req, res, item) {
    jobs.schedule('check-url', {
        uri: item.url,
        uniqueId: item._id.toString()
    }).on('complete', function() {
        Item.byId(item._id).then(function(item) {
            if(item) {
                userUpdate.updateItem(req.user._id, item);
            }
        }).done();
    })
}


exports.addItemToItem = function(parent, req, res) {
    var item = new Item(_.pick(req.body, 'type', 'title', 'url'));
    item.parent = parent._id;
    item.user = req.user._id;

    return item.saveWithPromise()
        .then(function() {
            parent.items.push(item._id);
            return parent.saveWithPromise();
        })
        .then(responses.sendModelId(res, item._id), errors.ifErrorSendBadRequest(res))
        .then(userUpdate.createItem.bind(null, req.user._id, item))
        .then(userUpdate.updateItem.bind(null, req.user._id, parent))
        .then(function() {
            if(item.isBookmark()) {
                launchItemJobs(req, res, item)
            }
        });
}

// this method used to add item to another item (because item could not exists without any parent container)
exports.addToItem = function(req, res) {
    req.check('type').isInt();
    req.check('parent').notEmpty();

    var errs = req.validationErrors();
    if (errs) return errors.sendBadRequest(res);

    return exports.addItemToItem(req.currentItem, req, res);
}

exports.addItemBookmarklet = function(req, res) {
    req.check('url').notEmpty();

    var errs = req.validationErrors();
    if (errs) return errors.sendBadRequest(res);

    var redirect = 'back';

    var query = req.query;
    if(query.next === 'same') {
        redirect = query.url;
    }

    Item.by({ _id: query.to || req.user.laterListboard, user: req.user._id }).then(function(parent) {
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
                        launchItemJobs(req, res, item)
                    }
                });
        } else {
            res.redirect(redirect);
        }
    })
    .done();
}

//Update item
exports.update = function(req, res) {
    var item = req.currentItem;    
    _.merge(item, _.pick(req.body, 'title'));// for now only title can be changed, by idea will need to add url and note depending from type of item
    
    item.saveWithPromise()
        .then(responses.sendModelId(res, item._id), errors.ifErrorSendBadRequest(res))
        .then(userUpdate.updateItem.bind(null, req.user._id, item))
        .done();
}

//Find item by id
exports.item = function(req, res, next, id) {
    Item.by({ _id: id, user: req.user })
        .then(function(item) {
            if (!item) return errors.sendNotFound(res);

            req.currentItem = item;
            next();
        }, next)
        .done();
}

//TODO need to send updates to client
function removeItem(item) {
    return Item.all({ _id: { $in: item.items } }).then(function(items) {
        return Q.all(items.map(removeItem));
    }).then(function() {
        item.deleted = true;
        return item.saveWithPromise();
    });
}

//Remove item
exports.delete = function(req, res) {
    var item = req.currentItem,
        user = req.user;

    //1 delete parent reference
    if(item.parent) { //simple item
        return Item.byId({ _id: item.parent })
            .then(function(parent) {
                parent.items.remove(item._id);
                return parent.saveWithPromise().then(userUpdate.updateItem.bind(null, req.user._id, parent));
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
