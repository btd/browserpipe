var _ = require('lodash'),
    q = require('q'),
    mongoose = require('mongoose'),
    Invitation = mongoose.model('Invitation')

//Create invitation
exports.create = function (req, res) {
    var invitation = new Invitation(req.body)
    q.all([invitation.saveWithPromise()])
        .spread(function () {
            res.json({ _id: invitation._id })
        },function (err) {
            //TODO: send corresponding number error
            res.json(err.errors)
        }).done()
}