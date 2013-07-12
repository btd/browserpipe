var _ = require('lodash'),
    q = require('q'),
    mongoose = require('mongoose'),
    List = mongoose.model('List'),
    Listboard = mongoose.model('Listboard'),
    Item = mongoose.model('Item')

//No listboard
exports.showEmpty = showListboard;

//Show listboard
exports.show = showListboard;

//Create listboard
exports.create = function (req, res) {
    var listboard = new Listboard({ label: req.body.label, user: req.user });
    req.user.currentListboard = listboard;
    q.all([listboard.saveWithPromise(),
            req.user.saveWithPromise()])
        .spread(function () {
            res.json({ _id: listboard._id })
        },function (err) {
            res.json(400, err.errors);
        }).done()
}

//Update listboard
exports.update = function (req, res) {

    var listboard = req.currentListboard;
    listboard.label = req.body.label
    listboard.saveWithPromise().then(function () {
        res.json({ _id: listboard._id })
    },function (err) {
        //TODO: send corresponding number error
        res.json(err.errors)
    }).done()


}

//Find listboard by id
exports.listboard = function (req, res, next, id) {
    Listboard
        .findOne({ _id: id })
        .exec(function (err, listboard) {
            if (err) return next(err)
            req.currentListboard = listboard
            next()
        })
}

function showListboard(req, res) {
    q.all([
            Listboard.getAll(req.user),
            List.getAll(req.user)
        ]).spread(function (listboards, lists) {
            //We only load the ones from opened containers

            var containerFilters = _(listboards).map(function (listboard) {
                return _.map(listboard.containers, 'filter');
            }).flatten().value();

            Item.getAllByFilters(
                    req.user,
                    containerFilters
                ).then(function (items) {
                    res.render('main/home', {
                            currentListboardId: ((req.currentListboard && req.currentListboard.id) || req.user.currentListboard.id),
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
    var listboard = req.currentListboard;
    listboard.remove(function (err) {
        res.json({ _id: listboard._id })
    })

}