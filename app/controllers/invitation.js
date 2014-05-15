/* jshint node: true */

var Invitation = require('../../models/invitation'),
    responses = require('../responses'),
    errors = require('../errors');

//Find listboard by id
exports.invitation = function(req, res, next, id) {
    return Invitation.by({ _id: id })
        .then(function(invitation) {
            //TODO: redirect to nice 404 page
            if (!invitation) return errors.sendNotFound(res);

            req.invitation = invitation;
            next();
        }, next);
};

exports.accepted = function(req, res, next) {
	if (req.invitation && req.invitation.accepted)
		next();
	else
		return errors.sendNotFound(res);
};

//Create invitation
exports.create = function (req, res) {
    var invitation = new Invitation(req.body); //TODO pick fields
    return invitation.saveWithPromise()
        .then(responses.sendModelId(res, invitation._id))
        .error(errors.ifErrorSendBadRequest(res))
}
