var _ = require('lodash'),
    q = require('q'),
    mongoose = require('mongoose'),
    List = mongoose.model('List'),
    Item = mongoose.model('Item'),
    responses = require('../util/responses.js'),
    errors = require('../util/errors.js');

//No listboard
//exports.showEmpty = showListboard;

//Show listboard
//exports.show = showListboard;

//Create listboard
exports.create = function (req, res) {

    var listboard = req.user.addLaterListboard(_.pick(req.body, 'label'));

    req.user.saveWithPromise()
        .then(responses.sendModelId(res, listboard._id))
        .fail(errors.ifErrorSendBadRequest(res))
        .done();
}

//Update listboard
exports.update = function (req, res) {
    var listboard = req.currentListboard;
    _.merge(listboard, _.pick(req.body, 'label'));

    req.user.saveWithPromise()
        .then(responses.sendModelId(res, listboard._id))
        .fail(errors.ifErrorSendBadRequest(res))
        .done();
};

//Find nowListboard by id
exports.nowListboard = function (req, res, next, id) {
    /*req.nowListboard = req.user.nowListboards.id(id);
    if(!req.nowListboard) {
        errors.sendNotFound(res);
    } else {
        next();
    }*/
    //TODO: this is temporal until we use OAuth2 to get proper listboard    
    if(req.user.nowListboards.length > 0){
        req.nowListboard = req.user.nowListboards[0]
        next();
    }
    else 
        errors.sendNotFound(res);
};

/*function showListboard(req, res) {
    var listboards = req.user.listboards;
    List.getAll(req.user)
        .then(function (lists) {
            //We only load the ones from opened containers

            var containerFilters = _(listboards).map(function (listboard) {
                return _.map(listboard.containers, 'filter');
            }).flatten().value();

            Item.findAllByFilters(
                    req.user,
                    containerFilters
                ).then(function (items) {
                    res.render('main/home', {
                            currentListboardId: ((req.currentListboard && req.currentListboard._id) || req.user.currentListboard._id),
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

}*/

//Delete item
exports.destroy = function (req, res) {
    var listboard = req.currentListboard.remove();

    req.user.saveWithPromise()
        .then(responses.sendModelId(res, listboard._id))
        .fail(errors.ifErrorSendBadRequest(res))
        .done();
}


//Sync windows and tabs
exports.sync = function (req, res) {
    //TODO: it has to get the user according to the browser and oauth

    var user = req.user;
    var nowListboard = req.nowListboard;
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
