var _ = require('lodash'),
    q = require('q'),
    mongoose = require('mongoose'),
    Window = mongoose.model('Window'),
    responses = require('../util/responses.js'),
    errors = require('../util/errors.js');

//Create browser
exports.create = function (req, res) {
    var browser = req.user.addBrowser(_.pick(req.body, 'name'));

    req.user.saveWithPromise()
        .then(responses.sendModelId(res, browser))
        .fail(errors.ifErrorSendBadRequest(res))
        .done();
}

//Update browser
exports.update = function (req, res) {
    var browser = req.currentBrowser;    
    _.merge(browser, _.pick(req.body, 'name'));

    req.user.saveWithPromise()
        .then(responses.sendModelId(res, browser))
        .fail(errors.ifErrorSendBadRequest(res))
        .done();
};

//Find browser by id
exports.browser = function (req, res, next, id) {
    //TODO: remove temporary code when we add OAuth    
    if(req.user)
        req.currentBrowser = req.user.browsers.id(id);
    if(!req.currentBrowser) {

        //Temporary code
        //Looks for the browsers of the first user (as we are testing with one user)
        var user = User.findOne()
        .execWithPromise()
        .then(function (user) {            
            req.currentBrowser = user.browsers.id(id);
            if(!req.currentBrowser)
                errors.sendNotFound(res);
            else
                next();
        })
        .fail(function(err) {
            errors.sendNotFound(res);
        })
        .done();     
        //END of temporary code
    } else {
        next();
    }
};


//Delete item
exports.destroy = function (req, res) {
    var browser = req.currentBrowser.remove();

    req.user.saveWithPromise()
        .then(responses.sendModelId(res, browser))
        .fail(errors.ifErrorSendBadRequest(res))
        .done();
}

//Sync windows and tabs
exports.sync = function (req, res) {
    //TODO: it has to get the user according to the browser and oauth
    var browser = req.currentBrowser;
    var newWindows = req.body.windows;
    var syncDate = new Date();

    //Todo optimize to:
    //1- save in a bunch
    //2- use promises correctly

    var winPromises = _.map(newWindows, function (newWin) {
        //Checks if windows exists
        return Window.getByExternalId(newWin.externalId)
            .then(function(winExistent) {                
                var win = winExistent
                if (!win){
                    //If windows do not exitst, we create it
                    win = new Window(_.pick(newWin, 'externalId'))
                    win.active = true;
                    win.browser = browser;                     
                }
                var tabsIds = _.map(win.tabs, function(tab){ return tab.externalId});
                //Add tabs
                _.map(newWin.tabs, function (tabobj) {    
                    if(_.indexOf(tabsIds, tabobj.externalId) == -1){ //If it does not contain tab, we create it
                        var tab = _.pick(tabobj, 'externalId', 'title', 'url', 'favicon')
                        tab.lastSyncDate  = syncDate;                               
                        win.addTab(tab);                 
                    }
                });         
                //Check closed tabs
                var newTabsIds = _.map(newWin.tabs, function(tab){ return tab.externalId});
                _.map(win.tabs, function (tab) {    
                    if(_.indexOf(newTabsIds, tab.externalId) == -1){ //If it does not contain tab, we create it
                        tab.active = false;
                        tab.closedDate = syncDate;                      
                    }
                });

                //Saves window
                win.lastSyncDate = syncDate;
                return win.saveWithPromise();
            })
    });
    //Check closed windows
    q.all(winPromises)
        .then(function () {
             Window.getAllActiveByBrowser(browser)
                .then(function (windows) {
                    return _.map(windows, function(win){                        
                        if(win.lastSyncDate.getTime() != syncDate.getTime()){                            
                            win.active = false;
                            win.closedDate = syncDate;                            
                        } 
                        return win.saveWithPromise().done();
                    })
                })
        }).done();

    responses.sendModelId(res, browser)();
}