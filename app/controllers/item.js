/* jshint node: true */

var _ = require('lodash'),
    mongoose = require('mongoose'),
    Item = mongoose.model('Item'),
    responses = require('../util/responses.js'),
    errors = require('../util/errors.js'),
    jobs = new (require('../../jobs/manager'));

var saveItem = function(req, res, item, delta) {
    return item.saveWithPromise()
        .then(responses.sendModelId(res, item._id))
        .fail(errors.ifErrorSendBadRequest(res))
        .then(updateClients(req, delta))
}

var updateClients = function(req, delta) {
    return function() {
        req.sockets.forEach(function(s) {
            s.emit(delta.type, delta.data);
        });
    }
}

//Create item
exports.create = function(req, res) {
    var item = new Item(_.pick(req.body, 'type', 'folders', 'containers', 'title', 'url', 'note'));

    if (!item.title)
        item.title = item.url;

    item.user = req.user;

    var delta = {
        type: 'create.item',
        data: item
    }

    saveItem(req, res, item, delta)
        .then(launchItemJobs(req, res, item))
        .done();
}


var launchItemJobs = function(req, res, item) {
    return function() {
        var delta = {
            type: 'update.item',
            data: item
        }        
        jobs.schedule('check url', {
            uri: item.url,
            uniqueId: item._id.toString()
        }).on('complete', function() {
            item.favicon = "/screenshots/" + item._id.toString() + "/favicon.png";
            saveItem(req, res, item, delta)
                .done();
        })
        jobs.schedule('screenshot', {
            uri: item.url,
            uniqueId: item._id.toString()
        }).on('complete', function() {
            item.screenshot = "/screenshots/" + item._id.toString() + "/screenshot.jpg";
            saveItem(req, res, item, delta)
                .done();
        })
    }
}

//Update item
exports.update = function(req, res) {
    var item = req.currentItem;
    //We mark them so mongoose saves them
    //TODO: add addcontainer/addfolder/removecontainer/removefolder rest calls to optimize    
    item.markModified('containers');
    item.markModified('folders');
    _.merge(item, _.pick(req.body, 'type', 'folders', 'containers', 'title', 'url', 'note'));
    //We need to merge array manually, because empty arrays are not merged
    if (req.body.containers)
        item.containers = req.body.containers;
    if (req.body.folders)
        item.folders = req.body.folders;

    var delta = {
        type: 'update.item',
        data: item
    }

    saveItem(req, res, item, delta)
        .done();
}

//Find item by id
exports.item = function(req, res, next, id) {
    Item.byId(id)
        .then(function(item) {
            if (!item)
                errors.sendNotFound(res);
            else {
                if (item.user != req.user._id.toString())
                    errors.sendForbidden(res);
                else {
                    req.currentItem = item;
                    next()
                }
            }
        }).fail(function(err) {
            next(err);
        });
}

//Delete item
exports.destroy = function(req, res) {
    var item = req.currentItem

    var delta = {
        type: 'delete.item',
        data: item
    }

    item.removeWithPromise()
        .then(responses.sendModelId(res, item._id))
        .fail(errors.ifErrorSendBadRequest(res))
        .then(updateClients(req, delta))
        .done();
}