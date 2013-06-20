var _ = require('lodash'),
    q = require('q'),
    mongoose = require('mongoose'),
    Item = mongoose.model('Item')

//Create item
exports.create = function (req, res) {
    if (req.isAuthenticated()) {
        var item = new Item(req.body)
        item.user = req.user
        req.user.currentItem = item
        q.all([item.saveWithPromise(),
                req.user.saveWithPromise()])
            .spread(function () {
                res.json({ _id: item._id })
            },function (err) {
                //TODO: send corresponding number error
                res.json(err.errors)
            }).done()
    }
    else
        res.send("invalid request")
}

//Update item
exports.update = function (req, res) {
    if (req.isAuthenticated() && req.currentItem) {
        var item = req.currentItem;
        item.tags = req.body.tags
        item.title = req.body.title
        item.url = req.body.url
        item.note = req.body.note
        item.saveWithPromise().then(function () {
            res.json({ _id: item._id })
        },function (err) {
            //TODO: send corresponding number error
            res.json(err.errors)
        }).done()
    }
    else
        res.send("invalid request")
}

//Find item by id
exports.item = function (req, res, next, id) {
    Item
        .findOne({ _id: id })
        .exec(function (err, item) {
            if (err) return next(err)
            req.currentItem = item
            next()
        })
}

//Delete item
exports.destroy = function (req, res) {
    if (req.isAuthenticated() && req.currentItem) {
        var item = req.currentItem
        item.remove(function (err) {
            res.json({ _id: item._id })
        })
    }
    else
        res.send("invalid request")
}