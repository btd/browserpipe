/* jshint node: true */

var _ = require('lodash'),
    mongoose = require('mongoose'),
    Item = mongoose.model('Item'),
    responses = require('../util/responses.js'),
    errors = require('../util/errors.js');

//Create item
exports.create = function (req, res) {
    var item = new Item(_.pick(req.body, 'lists', 'title', 'url', 'note'));
    item.user = req.user;
    item.saveWithPromise()
        .then(responses.sendModelId(res, item._id))
        .fail(errors.ifErrorSendBadRequest(res))
        .done();
}

//Update item
exports.update = function (req, res) {    
    var item = req.currentItem;
    _.merge(item, _.pick(req.body, 'lists', 'title', 'url', 'note'));
    item.saveWithPromise()
        .then(responses.sendModelId(res, item._id))
        .fail(errors.ifErrorSendBadRequest(res))
        .done();
}

//Find item by id
exports.item = function (req, res, next, id) {
    Item.byId(id)
        .then(function(item) {
            if (!item) 
                errors.sendNotFound(res);
            else {
                if (item.user !=  req.user._id.toString()) 
                    errors.sendForbidden(res);
            else {
                req.currentList = item;
                next()
            }}
        }).fail(function(err) {
            next(err);
        });
}

//Delete item
exports.destroy = function (req, res) {
    var item = req.currentItem
    item.remove(function () {
        res.json({ _id: item._id })
    })
}