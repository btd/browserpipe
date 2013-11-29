/* jshint node: true */

var Invitation = require('../../models/invitation'),
    responses = require('../responses'),
    errors = require('../errors');

//Find listboard by id
exports.invitation = function(req, res, next, id) {
    Invitation.by({ _id: id, user: req.user })
        .then(function(invitation) {
            //TODO: redirect to nice 404 page
            if (!invitation) return errors.sendNotFound(res);

            req.invitation = invitation;
            next();
        }, next)
        .done();
};

exports.accepted = function(req, res, next) {	
	if (req.invitation && req.invitation.accepted) 
		next();
	else 
		return errors.sendNotFound(res);
};

//Create invitation
exports.create = function (req, res) {
    var invitation = new Invitation(req.body)
    invitation.saveWithPromise()
        .then(responses.sendModelId(res, invitation._id))
        .fail(errors.ifErrorSendBadRequest(res))
        .done();
}