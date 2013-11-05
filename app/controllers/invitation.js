/* jshint node: true */

var mongoose = require('mongoose'),
    Invitation = mongoose.model('Invitation'),
    responses = require('.././responses.js'),
    errors = require('.././errors.js');

//Create invitation
exports.create = function (req, res) {
    var invitation = new Invitation(req.body)
    invitation.saveWithPromise()
        .then(responses.sendModelId(res, invitation._id))
        .fail(errors.ifErrorSendBadRequest(res))
        .done();
}