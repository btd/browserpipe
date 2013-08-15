var _ = require('lodash'),
    q = require('q'),
    mongoose = require('mongoose'),
    Invitation = mongoose.model('Invitation'),
    responses = require('../util/responses.js'),
    errors = require('../util/errors.js');

//Create invitation
exports.create = function (req, res) {
    var invitation = new Invitation(req.body)
    invitation.saveWithPromise()
        .then(responses.sendModelId(res, invitation._id))
        .fail(errors.ifErrorSendBadRequest(res))
        .done();
}