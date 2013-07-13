var _ = require('lodash'),
    q = require('q'),
    mongoose = require('mongoose'),
    Listboard = mongoose.model('Listboard');


//Create container
exports.create = function (req, res) {
    Listboard.findOne({ _id: req.params.listboardId, user: req.user })
        .execWithPromise()
        .then(function (listboard) {

            listboard.addContainer(_.pick(req.body, 'title', 'filter', 'type'))
                .saveWithPromise().then(function () {
                    res.json({ _id: listboard._id })
                },function (err) {
                    //TODO: send corresponding number error
                    res.json(500, err.errors)
                });
        })
        .fail(function(err) {
            res.json(500, err.errors);
        });
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

                listboard.saveWithPromise().then(function () {
                    res.json({ _id: container._id })
                },function (err) {
                    //TODO: send corresponding number error
                    res.json(err.errors)
                }).done()
            } else {
                res.json(404, 'Not found');
            }

        })
        .fail(function(err) {
            res.json(500, err.errors);
        });

}


//Delete container
exports.destroy = function (req, res) {
    Listboard.findOne({ _id: req.params.listboardId, user: req.user })
        .execWithPromise()
        .then(function (listboard) {
            listboard.containers.pull({ _id: req.params.containerId });

            listboard.saveWithPromise().then(function () {
                res.json({ _id: req.params.containerId });
            },function (err) {
                //TODO: send corresponding number error
                res.json(500, err.errors)
            }).done()
        })
        .fail(function(err) {
            res.json(500, err.errors);
        });
}