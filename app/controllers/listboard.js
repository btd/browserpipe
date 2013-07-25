var _ = require('lodash'),
    q = require('q'),
    mongoose = require('mongoose'),
    List = mongoose.model('List'),
    Item = mongoose.model('Item')

//No listboard
exports.showEmpty = showListboard;

//Show listboard
exports.show = showListboard;

//Create listboard
exports.create = function (req, res) {
    var listboard = req.user.addCurrentListboard({ label: req.body.label });

    req.user.saveWithPromise()
        .then(function() {
            res.json({ _id: listboard._id })
        })
        .fail(function(err) {
            res.json(400, err.errors);
        });
}

//Update listboard
exports.update = function (req, res) {
    var listboard = req.currentListboard;
    if(listboard) {
        listboard.label = req.body.label
        listboard.saveWithPromise().then(function () {
            res.json({ _id: listboard._id })
        },function (err) {
            //TODO: send corresponding number error
            res.json(err.errors)
        }).done()
    }    
    else
        res.send(404, {error: 'Not found'});
}

//Find listboard by id
exports.listboard = function (req, res, next, id) {
    if(req.isAuthenticated()) {
        var listboard = req.user.listboards.id(id);
        req.currentListboard = listboard;
    }
    next();
}

function showListboard(req, res) {
    var listboards = req.user.listboards;
    List.getAll(req.user)
        .then(function (lists) {
            //We only load the ones from opened containers

            var containerFilters = _(listboards).map(function (listboard) {
                return _.map(listboard.containers, 'filter');
            }).flatten().value();

            Item.getAllByFilters(
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

}

//Delete item
exports.destroy = function (req, res) {
    if(req.currentListboard) {
        var listboard = req.currentListboard.remove();
        req.user.saveWithPromise()
            .then(function() {
                res.json({ _id: listboard._id });
            })
            .fail(function(err) {
                res.send(400, err);
            });
    } else {
        res.send(404, { error: 'Listboard does not exists'})
    }
}