/* jshint node: true */

var _ = require('lodash'),
    config = require('../../config'),
    Item = require('../../models/item'),
    responses = require('../responses'),
    errors = require('../errors'),

    jobs = new (require('../../jobs/manager'));

var userUpdate = require('./user_update');

var addItemToFolder = function(req, item) {
    return req.currentFolder.addItemId(item._id)
            .saveWithPromise()
            .then(userUpdate.updateFolder.bind(null, req.user._id, req.currentFolder));    
}

var addItemToContainer = function(req, item) {
    var container = req.listboard.containers.id(req.params.containerId);
    container.addItemId(item._id)
    return req.user.saveWithPromise()
            .then(userUpdate.updateContainer.bind(null, req.user._id, req.listboard._id, container));    
}

var addItemToFolderOrContainer = function(req, item){
    if(req.currentFolder)
        return addItemToFolder(req, item)
    else if (req.listboard && req.params.containerId){        
        return addItemToContainer(req, item)                        
    }   
}

//Create item
exports.create = function(req, res) {
    //TODO add validation
    var item = new Item(_.pick(req.body, 'type', 'title', 'note'));

    item.url = req.body.url;

    //We create default favicon that then will be update by job
    item.favicon = 'http://www.google.com/s2/favicons?domain=' + encodeURIComponent(item.url);
     
    item.user = req.user;

    item.saveWithPromise()
        .then()
        .then(responses.sendModelId(res, item._id), errors.ifErrorSendBadRequest(res))        
        .then(userUpdate.createItem.bind(null, req.user._id, item))        
        .then(addItemToFolderOrContainer(req, item))
        .then(launchItemJobs(req, res, item))        
        .done();
}


var launchItemJobs = function(req, res, item) {
    return function() {
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

    var item = req.currentItem;    
    _.merge(item, _.pick(req.body, 'type', 'title', 'note'));
    
    item.saveWithPromise()
        .then(responses.sendModelId(res, item._id), errors.ifErrorSendBadRequest(res))
        .then(userUpdate.updateItem.bind(null, req.user._id, item))
        .done();
}

//Find item by id
exports.item = function(req, res, next, id) {
    Item.by({ _id: id, user: req.user })
        .then(function(item) {
            if (!item) return errors.sendNotFound(res);

            req.currentItem = item;
            next();
        }, next)
        .done();
}

var removeItemFromFolder = function(req, item) {
    return req.currentFolder.removeItemId(item._id)
            .saveWithPromise()
            .then(userUpdate.updateFolder.bind(null, req.user._id, req.currentFolder));    
}

var removeItemFromContainer = function(req, item) {
    var container = req.listboard.containers.id(req.params.containerId);
    container.removeItemId(item._id)
    return req.user.saveWithPromise()
            .then(userUpdate.updateContainer.bind(null, req.user._id, req.listboard._id, container));    
}

var removeItemFromFolderOrContainer = function(req, item){
    if(req.currentFolder)
        return removeItemFromFolder(req, item)
    else if (req.listboard && req.params.containerId){        
        return removeItemFromContainer(req, item)                        
    }   
}

//Remove item
exports.remove = function(req, res) {
    var item = req.currentItem;

    item.removeWithPromise()
        .then(responses.sendModelId(res, item._id), errors.ifErrorSendBadRequest(res))
        .then(removeItemFromFolderOrContainer(req, item))
        .done();
}

exports.query = function(req, res, next, query) {
    req.query = query;
    next();
}


//Search item
exports.search = function(req, res) {
    Item.textSearch(req.query, function (err, output) {
        
        if (err) return errors.sendInternalServer(res);

        var ids = output.results.map(function(result) {
            return result.obj._id;
        })

        res.json({ query: req.query, items: ids });
    });
}