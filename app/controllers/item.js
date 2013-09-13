/* jshint node: true */

var _ = require('lodash'),
    mongoose = require('mongoose'),
    Item = mongoose.model('Item'),
    responses = require('../util/responses.js'),
    errors = require('../util/errors.js');

var saveItem = function(req, res, item, delta){
    item.saveWithPromise()
        .then(responses.sendModelId(res, item._id))
        .fail(errors.ifErrorSendBadRequest(res))
        .then(updateClients(req, delta))      
        .done();
}

var updateClients = function(req, delta) {
    return function(){
        req.sockets.forEach(function(s) {
            s.emit(delta.type, delta.data);
        });
    }
}

//Create item
exports.create = function (req, res) {
    var item = new Item(_.pick(req.body, 'type', 'lists', 'containers', 'title', 'url', 'note', 'cid'));

    if(!item.title)
        item.title = item.url;

    item.user = req.user;

    var delta = {
        type: 'create.item',
        data: item
    }
    
    saveItem(req, res, item, delta);
}

//Update item
exports.update = function (req, res) {    
    var item = req.currentItem;        
    //We mark them so mongoose saves them
    //TODO: add addcontainer/addlist/removecontainer/removelist rest calls to optimize    
    item.markModified('containers');
    item.markModified('lists');
    _.merge(item, _.pick(req.body, 'type', 'lists', 'containers', 'title', 'url', 'note', 'cid'));
    //We need to merge array manually, because empty arrays are not merged
    item.containers = req.body.containers;
    item.lists = req.body.lists;

    var delta = {
        type: 'update.item',
        data: item
    }
   
    saveItem(req, res, item, delta);
}

//Find item by id
exports.item = function (req, res, next, id) {
    Item.byId(id)
        .then(function(item) {
            if (!item) 
                errors.sendNotFound(res);
            else {
                if (item.user !=  req.user._id.toString()) 
                    errors.sendForbidden(res);
            else {
                req.currentItem = item;
                next()
            }}
        }).fail(function(err) {
            next(err);
        });
}

//Delete item
exports.destroy = function (req, res) {
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