var _ = require('lodash'),
    q = require('q'),
    mongoose = require('mongoose'),
    List = mongoose.model('List'),
    Item = mongoose.model('Item'),
    responses = require('../util/responses.js'),
    errors = require('../util/errors.js');

//Find laterListboard by id
exports.listboard = function (req, res, next, id) {    
    req.listboard = 
        req.user.nowListboards.id(id) ||
        req.user.laterListboards.id(id) ||
        req.user.futureListboards.id(id)

    if(!req.listboard) {
        errors.sendNotFound(res);
    } else {
        next();
    }
};

var saveListboard = function(req, res, listboard){
    req.user.saveWithPromise()
        .then(responses.sendModelId(res, listboard._id))
        .fail(errors.ifErrorSendBadRequest(res))
        .done();
}

//Create Later listboard
exports.create = function (req, res) {
    //You can only create later or future listboards  
    if(req.body.type === 1 || req.body.type === 2) {
        var listboard = req.user.addListboard(_.pick(req.body, 'label', 'type'));
        saveListboard(req, res, listboard);    
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
        saveListboard(req, res, listboard);    
    }
};

//Delete Later Listboard
exports.destroy = function (req, res) {
    var listboard = req.listboard.remove();
    saveListboard(req, res, listboard);    
}

//Sync windows and tabs
exports.sync = function (req, res) {
    //TODO: it has to get the user according to the browser and oauth

    var user = req.user;
    //TODO: listboard should be created by the extension if it does not existis, if not it should be loded by :listboardId
    var nowListboard = user.nowListboards[0];
    var windows = req.body.windows;
    var syncDate = new Date();

    //Updates the sync date
    nowListboard.lastSyncDate = syncDate;

    //Create the new ones
    var containersExternalIds = _.map(nowListboard.containers, function(cont){ return cont.externalId});
    _.map(windows, function (win) {
        //If there is no container for this window, we create it
        if(_.indexOf(containersExternalIds, win.externalId) == -1){ 
            nowListboard.addContainer({
                type: 0,
                title: 'Window',
                externalId: win.externalId,
                active: true
            });
        }
    });    

    //Deactivate the closed containers
    var windowsExternalIds = _.map(windows, function(win){ return win.externalId});
    _.map(nowListboard.containers, function (cont) {
        //If there is no container for this window, we create it
        if(_.indexOf(windowsExternalIds, cont) == -1){ 
            cont.active = false;
            cont.closedDate = syncDate;   
        }
    });    

    //Save the listboard
    user
        .saveWithPromise()
        .then(function(){
             
            //We sync the tabs
            var itemPromises = _.map(windows, function (win) {

                var promises = [];
                
                //We get the container that already exists
                var container = nowListboard.getContainerByExternalId(win.externalId);
                if(container){

                    Item.findByContainer(user, container._id).then(function(items){
                        //Create the new items
                        var itemsExternalIds = _.map(items, function(item){ return item.externalId});
                        _.map(win.tabs, function (tab) {    
                            //If it does not contain an item for this tab, we create it
                            if(_.indexOf(itemsExternalIds, tab.externalId) == -1){ 
                                var item = new Item(_.pick(tab, 'externalId', 'title', 'url', 'favicon'));
                                item.type = 0;
                                item.user = user._id;
                                item.containers = [container._id];
                                item.active = true;                            
                                var promise = item.saveWithPromise();
                                promises.push(promise);
                            }
                        });     

                        //Deactivate items for closed tabs
                        var tabsExternalIds = _.map(win.tabs, function(tab){ return tab.externalId});                    
                        _.map(items, function (item) {    
                            //If there is no tab for that item, we deactivate it
                            if(_.indexOf(tabsExternalIds, item.externalId) == -1){ 
                                item.active = false;
                                item.closedDate = syncDate;          
                                var promise = item.saveWithPromise();
                                promises.push(promise);
                            }
                        });                        
                    });                        
                    
                }
                return promises;
            })

            return q.all(itemPromises)            
        })
        .then(responses.sendModelId(res, nowListboard))
        .fail(errors.ifErrorSendInternalServer(res))
        .done();    
}
