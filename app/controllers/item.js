/* jshint node: true */

var _ = require('lodash'),
    config = require('../../config'),
    Item = require('../../models/item'),
    responses = require('../responses'),
    errors = require('../errors'),

    jobs = new (require('../../jobs/manager'));

var userUpdate = require('./user_update');


//Create item
exports.create = function(req, res) {
    //TODO add validation
    var item = new Item(_.pick(req.body, 'type', 'folders', 'containers', 'title', 'note'));

    item.url = req.body.url;

    //We create default favicon that then will be update by job
    item.favicon = 'http://www.google.com/s2/favicons?domain=' + encodeURIComponent(item.url);
     
    item.user = req.user;

    item.saveWithPromise()
        .then(responses.sendModelId(res, item._id), errors.ifErrorSendBadRequest(res))
        .then(userUpdate.createItem.bind(null, req.user._id, item))
        .then(launchItemJobs(req, res, item))
        .done();
}


var launchItemJobs = function(req, res, item) {
    return function() {
        var delta = {
            type: 'update.item',
            data: item
        }        
        jobs.schedule('check-url', {
            uri: item.url,
            uniqueId: item._id.toString()
        }).on('complete', function() {
            item.favicon = config.storeUrl + "/" + item._id.toString() + "/favicon.ico";
            item.saveWithPromise()
                .then(userUpdate.createItem.bind(null, req.user._id, item))
                .done();
        })
    }
}

//Update item
exports.update = function(req, res) {
    //TODO update
    console.error('This method is broken, need to update when we move containers and folders')

    var item = req.currentItem;
    //We mark them so mongoose saves them
    //TODO: add addcontainer/addfolder/removecontainer/removefolder rest calls to optimize    
    item.markModified('containers');
    item.markModified('folders');
    _.merge(item, _.pick(req.body, 'type', 'folders', 'containers', 'title', 'note'));
    //We need to merge array manually, because empty arrays are not merged
    if (req.body.containers)
        item.containers = req.body.containers;
    if (req.body.folders)
        item.folders = req.body.folders;

    res.send(500);
}

//Find item by id
exports.item = function(req, res, next, id) {
    Item.by({ id: id, user: req.user })
        .then(function(item) {
            if (!item) return errors.sendNotFound(res);

            req.currentItem = item;
            next();
        }, next)
        .done();
}

//Delete item
exports.destroy = function(req, res) {
    var item = req.currentItem;

    item.removeWithPromise()
        .then(responses.sendModelId(res, item._id), errors.ifErrorSendBadRequest(res))
        .then(userUpdate.createItem.bind(null, req.user._id, item))
        .done();
}