/* jshint node: true */

var _ = require('lodash'),
    responses = require('.././responses.js'),
    errors = require('.././errors.js');

var saveContainer = function(req, res, containerId, delta){
    req.user.saveWithPromise()
        .then(responses.sendModelId(res, containerId))
        .fail(errors.ifErrorSendBadRequest(res))
        .then(updateClients(req, delta))      
        .done();
}

var updateClients = function(req, delta) {
    return function(){
        req.sockets.forEach(function(s) {
            s.emit(delta.type, delta.data);
        });
    }
}

//Create container
exports.create = function (req, res) {
    var container = req.listboard.addContainer(_.pick(req.body, 'title', 'type')).last();
    var delta = {
        type: 'create.container',
        data: {
            listboardId: req.listboard._id,
            container: container
        }
    }
    saveContainer(req, res, container._id, delta);

}

//Update container
exports.update = function (req, res) {
    var containerIdx = _.findIndex(req.listboard.containers, function (c) {
        return c._id.toString() === req.params.containerId;
    });
    if (containerIdx >= 0) {
        var container = req.listboard.containers[containerIdx];
        _.merge(container, _.pick(req.body, 'title'));
        req.listboard.containers.set(containerIdx, container);
        var delta = {
            type: 'update.container',
            data: { 
                listboardId: req.listboard._id,
                container: container
            }   
        }
        saveContainer(req, res, container._id, delta);
    } 
    else 
        errors.sendNotFound(res);
}


//Delete container
exports.destroy = function (req, res) {
    var containerId = req.params.containerId;
    var containerIdx = _.findIndex(req.listboard.containers, function (c) {
        return c._id.toString() === containerId;
    });
    if (containerIdx >= 0) {
        var container = req.listboard.containers[containerIdx]
        container.remove();
        var delta = {
            type: 'delete.container',
            data: { 
                listboardId: req.listboard._id,
                containerId: containerId
            }   
        }
        saveContainer(req, res, containerId, delta);
    } 
    else 
        errors.sendNotFound(res);
}
    