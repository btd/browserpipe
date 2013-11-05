/* jshint node: true */

var _ = require('lodash'),
    q = require('q'),
    mongoose = require('mongoose'),    
    Item = mongoose.model('Item'),
    responses = require('.././responses.js'),
    errors = require('.././errors.js');

//Find listboard by id
exports.listboard = function (req, res, next, id) {    
    req.listboard = req.user.listboards.id(id);
    if(!req.listboard) {
        errors.sendNotFound(res);
    } else {
        next();
    }
};

//Find listboard by browser key
exports.browserKey = function (req, res, next, key) {   
    req.browserKey = key;
    //req.listboard = req.user.getListboardByBrowserKey(key);
    next();
};

//Find listboard by browser key
exports.browserName = function (req, res, next, name) {   
    req.browserName = name;
    next();
};

var saveListboard = function(req, res, listboard, delta){
    req.user.saveWithPromise()
        .then(responses.sendModelId(res, listboard._id))
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

//Create Later listboard
exports.create = function (req, res) {
    //User can only create listboards of type 1 
    if(req.body.type === 1) {
        var listboard = req.user.addListboard(_.pick(req.body, 'label', 'type'));        
        var delta = {
            type: 'create.listboard',
            data: listboard
        }
        saveListboard(req, res, listboard, delta);    
    }
    else 
        errors.sendBadRequest(res);
}

//Update Later listboard
exports.update = function (req, res) {

     //Validate user input
    req.check('label', 'Please enter a label').notEmpty();    

    //If errors, flash or send them
    var err = req.validationErrors();
    if (err)
        errors.sendBadRequest(res);
    else {
        var listboard = req.listboard;
        _.merge(listboard, _.pick(req.body, 'label'));
        var delta = {
            type: 'update.listboard',
            data: listboard
        }
        saveListboard(req, res, listboard, delta);                
    }
};

//Delete Later Listboard
exports.destroy = function (req, res) {

    var listboard = req.listboard;

    //We do not send an items update, no need, it will just removed an unexistent container
    var delta = {
        type: 'delete.listboard',
        data: listboard
    }        

    //Deltas for items removed    
    var deltaItems = { type: 'bulk.update.item', data: [] } 

    req.user.removeListboard(listboard);

    //Remove items from listboard containers
    Item.removeAllByContainers(req.user, listboard.containers)
        .then(saveListboard(req, res, listboard, delta))          
        .done()    
};
