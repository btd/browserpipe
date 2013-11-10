/* jshint node: true */

var _ = require('lodash'),
    responses = require('../responses'),
    errors = require('../errors');

var userUpdate = require('./user_update');

var saveContainer = function(req, res, container){
    return req.user.saveWithPromise()
        .then(responses.sendModelId(res, container._id))
        .fail(errors.ifErrorSendBadRequest(res));
}

//Create container
exports.create = function (req, res) {
    var container = req.listboard.addContainer(_.pick(req.body, 'title', 'type')).last();

    saveContainer(req, res, container)
      .then(userUpdate.createContainer.bind(null, req.user._id, req.listboard._id, container))
      .done();
}

//Update container
exports.update = function (req, res) {
    var container = req.listboard.containers.id(req.params.containerId);

    if (container) {
        _.merge(container, _.pick(req.body, 'title')); //it works because by reference it is the same object!

        saveContainer(req, res, container)
          .then(userUpdate.updateContainer.bind(null, req.user._id, req.listboard._id, container))
          .done();
    } else
        errors.sendNotFound(res);
}


//Delete container
exports.destroy = function (req, res) {
    var container = req.listboard.containers.id(req.params.containerId);
    if (container) {
        container.remove();

        saveContainer(req, res, container)
          .then(userUpdate.deleteContainer.bind(null, req.user._id, req.listboard._id, container))
          .done();
    } else
        errors.sendNotFound(res);
}
    