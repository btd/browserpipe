/* jshint node: true */

var _ = require('lodash'),
    responses = require('../util/responses.js'),
    errors = require('../util/errors.js');    

var saveContainer = function(req, res, containerId){
    req.user.saveWithPromise()
        .then(responses.sendModelId(res, containerId))
        .fail(errors.ifErrorSendBadRequest(res))
        .done();
}

//Create container
exports.create = function (req, res) {
    var container = req.listboard.addContainer(_.pick(req.body, 'title', 'filter', 'type')).last();
    saveContainer(req, res, container._id);
}

//Update container
exports.update = function (req, res) {
    var containerIdx = _.findIndex(req.listboard.containers, function (c) {
        return c._id.toString() === req.params.containerId;
    });
    if (containerIdx >= 0) {
        var container = req.listboard.containers[containerIdx];
        _.merge(container, _.pick(req.body, 'title', 'filter'));
        req.listboard.containers.set(containerIdx, container);
        saveContainer(req, res, container._id);
    } 
    else 
        errors.sendNotFound(res);
}


//Delete container
exports.destroy = function (req, res) {
    var containerId = req.params.containerId;
    saveContainer(req, res, containerId);
}