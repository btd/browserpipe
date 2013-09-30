/* jshint node: true */

var _ = require('lodash'),
    q = require('q'),
    mongoose = require('mongoose'),
    Item = mongoose.model('Item'),
    responses = require('../util/responses.js'),
    errors = require('../util/errors.js');

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
    req.listboard = req.user.getListboardByBrowserKey(key);
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
    //You can only create listboards of type 1 
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
    req.check('label', 'Please a label').notEmpty();    

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

    req.user.removeListboard(listboard)
        .saveWithPromise()
        .then(function() {
            //Items with all folders and descendant folders are updated
            return Item.findAllByContainers(req.user, listboard.containers)                 
        })
        .then(function(items) {
            console.log(items.length);
            var promises = _.map(items, function(item) {                            
                _.map(listboard.containers, function(containerId) {
                    item.containers.remove(containerId)
                });                    
                return item.saveWithPromise();
            });
            return q.all(promises);
        })
        .then(saveListboard(req, res, listboard, delta))          
        .done()    
}

var sendCreateListboardDelta = function(req, listboard) {    
    if(!req.listboard)
        return req.sockets.forEach(function(s) {
            s.emit('create.listboard',listboard);
        });
    else
        return;
}

var fillAndSendCreateContainersDelta = function(req, listboard, type, externalIds) {    
    return function(){        
        if(externalIds.length > 0) {
            var containers = _.map(externalIds, function(externalId){                 
                return listboard.getContainerByExternalId(externalId);
            });            
            req.sockets.forEach(function(s) {
                s.emit(type, { 
                    listboardId: listboard._id,
                    containers: _.compact(containers) 
                });
            });
        }
    }
}

var fillAndSendDeleteContainersDelta = function(req, listboard, type, externalIds) {    
    return function(){        
        if(externalIds.length > 0) {
            var containerIds = _.map(externalIds, function(externalId){                 
                return listboard.getContainerByExternalId(externalId)._id;
            });            
            req.sockets.forEach(function(s) {
                s.emit(type, { 
                    listboardId: listboard._id,
                    containerIds: _.compact(containerIds) 
                });
            });
        }
    }
}

var fillAndSendCreateUpdateItemsDelta = function(req, type, externalIds) {
    return function(){                
        if(externalIds.length > 0) {            
            q.all(_.map(externalIds, function(externalId){ 
                return Item.getByExternalId(req.user, externalId);
            })).spread(function () { 
                var items = arguments;
                req.sockets.forEach(function(s) {
                    s.emit(type, _.compact(items) );
                });
            }).done();
        }
    }
}

//Sync windows and tabs
exports.sync = function (req, res) {
    //TODO: it has to get the user according to the browser and oauth

    var user = req.user;    
    var listboard = req.listboard;
    if(!listboard) {
        listboard = user.addListboard({type: 0, label: 'My ' + req.browserName + ' browser', browserKey: req.browserKey})        
    }
    
    var windows = req.body.windows;
    var syncDate = new Date();

    //Updates the sync date
    listboard.lastSyncDate = syncDate;

    //Create arrays to send Socket.io delta
    var createdContainersExternalIds = [];
    var deletedContainersExternalIds = [];
    var createdItemsExternalIds = [];
    var updatedtemsExternalIds = [];
    
    //Create the new ones
    var containersExternalIds = _.map(listboard.containers, function(cont){ return cont.externalId});
    _.map(windows, function (win) {
        //If there is no container for this window, we create it
        if(_.indexOf(containersExternalIds, win.externalId) == -1){ 
            
            listboard.addContainer({
                type: 0,
                externalId: win.externalId
            });     
            
            createdContainersExternalIds.push(win.externalId);
        }
    });      

    //Deactivate the closed containers    
    var windowsExternalIds = _.map(windows, function(win){ return win.externalId});
    _.map(listboard.containers, function (cont) {        
        if(_.indexOf(windowsExternalIds, cont.externalId) == -1){ 
            
            listboard.removeContainer(cont);
            
            deletedContainersExternalIds.push(cont.externalId);
        }
    });    

    //Save the listboard
    user
        .saveWithPromise()
        .then(function(){

            //We sync the tabs             
            var result = _.map(windows, function (win) {
                
                //We get the container that already exists
                var container = listboard.getContainerByExternalId(win.externalId);
                if(container){                    

                    return Item.findByContainer(user, container._id).then(function(items){
                        var promises = [];

                        //Create the new items
                        var itemsExternalIds = _.map(items, function(item){ return item.externalId});
                        _.map(win.tabs, function (tab) {    
                            //If it does not contain an item for this tab, we create it
                            if(_.indexOf(itemsExternalIds, tab.externalId) == -1){ 
                                
                                var item = new Item(_.pick(tab, 'externalId', 'title', 'url', 'favicon'));
                                item.type = 0;
                                item.user = user._id;
                                item.containers = [container._id];          
                                var promise = item.saveWithPromise();
                                promises.push(promise);
                                
                                createdItemsExternalIds.push(item.externalId);
                            }
                        });     

                        //Deactivate items for closed tabs
                        var tabsExternalIds = _.map(win.tabs, function(tab){ return tab.externalId});                    
                        _.map(items, function (item) {    
                            //If there is no tab for that item, we deactivate it
                            if(_.indexOf(tabsExternalIds, item.externalId) == -1) { 
                                
                                item.containers.remove(container._id);
                                var promise = item.saveWithPromise();
                                promises.push(promise);
                                
                                updatedtemsExternalIds.push(item.externalId);
                            }
                        });    

                        return q.all(promises);                     
                    });                       
                    
                }
            });                 
            return q.all(result);
        })
        .then(responses.sendModelId(res, listboard))
        .fail(errors.ifErrorSendInternalServer(res))
        .then(sendCreateListboardDelta(req, listboard))
        .then(fillAndSendCreateContainersDelta(req, listboard, 'bulk.create.container', createdContainersExternalIds))
        .then(fillAndSendDeleteContainersDelta(req, listboard, 'bulk.delete.container', deletedContainersExternalIds))
        .then(fillAndSendCreateUpdateItemsDelta(req, 'bulk.create.item', createdItemsExternalIds))
        .then(fillAndSendCreateUpdateItemsDelta(req, 'bulk.update.item', updatedtemsExternalIds))
        .done();    
}
