/* jshint node: true */

var _ = require('lodash'),
    Item = require('../../models/item'),
    responses = require('.././responses.js'),
    errors = require('.././errors.js');

var q = require('q');

var userUpdate = require('./user_update');

//Find listboard by id
exports.listboard = function (req, res, next, id) {
    req.listboard = req.user.listboards.id(id);
    if (!req.listboard) {
        errors.sendNotFound(res);
    } else {
        next();
    }
};

//Create Later listboard
exports.create = function (req, res) {
    req.check('type').isInt().equals(1);
    req.check('label').notEmpty();

    var errs = req.validationErrors();
    if (errs) return errors.sendBadRequest(res);

    var listboard = req.user.addListboard(_.pick(req.body, 'label', 'type'));

    req.user.saveWithPromise()
        .then(responses.sendModelId(res, listboard._id), errors.ifErrorSendBadRequest(res))
        .then(userUpdate.createListboard.bind(null, req.user.id, listboard))
        .done();
}

//Update Later listboard
exports.update = function (req, res) {

    //Validate user input
    req.check('label', 'Please enter a label').notEmpty();

    //If errors, flash or send them
    var err = req.validationErrors();
    if (err) return errors.sendBadRequest(res);

    var listboard = req.listboard;
    _.merge(listboard, _.pick(req.body, 'label'));

    req.user.saveWithPromise()
        .then(responses.sendModelId(res, listboard._id), errors.ifErrorSendBadRequest(res))
        .then(userUpdate.updateListboard.bind(null, req.user.id, listboard))
        .done();
};

//Delete Later Listboard
exports.destroy = function (req, res) {

    var listboard = req.listboard;

    //Deltas for items removed
    Item.where('user').equals(req.user).where('containers').in(listboard.containers).execWithPromise()
        .then(function(items) {
            items = items.map(function(i) {
                listboard.containers.forEach(function(c) {
                    i.containers.remove(c._id);
                })
                return i;
            });

            userUpdate.bulkUpdateItem(req.user._id, items);
            return q.all(items.map(function(i) {
                return i.saveWithPromise(); }));
        });

    req.user.removeListboard(listboard);

    //Remove items from listboard containers
    req.user.saveWithPromise()
        .then(responses.sendModelId(res, listboard._id), errors.ifErrorSendBadRequest(res))
        .then(userUpdate.deleteListboard.bind(null, req.user.id, listboard))
        .done();
};
