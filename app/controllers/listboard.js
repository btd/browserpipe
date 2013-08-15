var _ = require('lodash'),
    q = require('q'),
    mongoose = require('mongoose'),
    List = mongoose.model('List'),
    Item = mongoose.model('Item'),
    responses = require('../util/responses.js'),
    errors = require('../util/errors.js');

//No listboard
//exports.showEmpty = showListboard;

//Show listboard
//exports.show = showListboard;

//Create listboard
exports.create = function (req, res) {
    var listboard = req.user.addListboard(_.pick(req.body, 'label'));

    req.user.saveWithPromise()
        .then(responses.sendModelId(res, listboard._id))
        .fail(errors.ifErrorSendBadRequest(res))
        .done();
}

//Update listboard
exports.update = function (req, res) {
    var listboard = req.currentListboard;
    _.merge(listboard, _.pick(req.body, 'label'));

    req.user.saveWithPromise()
        .then(responses.sendModelId(res, listboard._id))
        .fail(errors.ifErrorSendBadRequest(res))
        .done();
};

//Find listboard by id
exports.listboard = function (req, res, next, id) {
    req.currentListboard = req.user.listboards.id(id);
    if(!req.currentListboard) {
        errors.sendNotFound(res);
    } else {
        next();
    }
};

/*function showListboard(req, res) {
    var listboards = req.user.listboards;
    List.getAll(req.user)
        .then(function (lists) {
            //We only load the ones from opened containers

            var containerFilters = _(listboards).map(function (listboard) {
                return _.map(listboard.containers, 'filter');
            }).flatten().value();

            Item.findAllByFilters(
                    req.user,
                    containerFilters
                ).then(function (items) {
                    res.render('main/home', {
                            currentListboardId: ((req.currentListboard && req.currentListboard._id) || req.user.currentListboard._id),
                            user: req.user,
                            listboards: listboards,
                            items: items,
                            lists: lists}
                    );
                }, function (error) {
                    res.render('500')
                });
        },function () {
            res.render('500')
        }).done();

}*/

//Delete item
exports.destroy = function (req, res) {
    var listboard = req.currentListboard.remove();

    req.user.saveWithPromise()
        .then(responses.sendModelId(res, listboard._id))
        .fail(errors.ifErrorSendBadRequest(res))
        .done();
}