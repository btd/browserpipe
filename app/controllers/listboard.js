/* jshint node: true */

var _ = require('lodash'),    
    responses = require('.././responses.js'),
    errors = require('.././errors.js');

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

    var errs = req.validationErrors();
    if (errs) return errors.sendBadRequest(res);

    var listboard = req.user.addListboard(_.pick(req.body, 'label', 'type'));
    listboard.addContainer({type: 1, title: 'New window' });

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
    req.user.removeListboard(listboard);
    
    req.user.saveWithPromise()
        .then(responses.sendModelId(res, listboard._id), errors.ifErrorSendBadRequest(res))
        .then(userUpdate.deleteListboard.bind(null, req.user.id, listboard))
        .done();
};
