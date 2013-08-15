var _ = require('lodash'),
    q = require('q'),
    mongoose = require('mongoose'),
    responses = require('../util/responses.js'),
    errors = require('../util/errors.js');


//Create container
exports.create = function (req, res) {
    Listboard.findOne({ _id: req.params.listboardId, user: req.user })
        .execWithPromise()
        .then(function (listboard) {

            listboard.addContainer(_.pick(req.body, 'title', 'filter', 'type'))
                .saveWithPromise()
                .then(responses.sendModelId(res, _.last(listboard.containers)._id))
                .fail(errors.ifErrorSendBadRequest(res))
                .done();
        })
        .fail(errors.ifErrorSendBadRequest(res))
        .done();
}

//Update container
exports.update = function (req, res) {
    Listboard.findOne({ _id: req.params.listboardId, user: req.user })
        .execWithPromise()
        .then(function (listboard) {

            var containerIdx = _.findIndex(listboard.containers, function (c) {
                return c._id.toString() === req.params.containerId;
            });


            if (containerIdx >= 0) {
                var container = listboard.containers[containerIdx];

                _.merge(container, _.pick(req.body, 'title', 'filter'));

                listboard.containers.set(containerIdx, container);

                listboard.saveWithPromise()
                    .then(responses.sendModelId(res, container._id))
                    .fail(errors.ifErrorSendBadRequest(res))
                    .done()
            } else {
                errors.sendNotFound(res);
            }

        })
        .fail(errors.ifErrorSendBadRequest(res))
        .done();
}


//Delete container
exports.destroy = function (req, res) {
    Listboard.findOne({ _id: req.params.listboardId, user: req.user })
        .execWithPromise()
        .then(function (listboard) {
            var containerId = req.params.containerId
            listboard.containers.pull({ _id: containerId });

            listboard.saveWithPromise()
                .then(responses.sendModelId(res, containerId))
                .fail(errors.ifErrorSendBadRequest(res))
                .done();
        })
        .fail(errors.ifErrorSendBadRequest(res))
        .done();
}