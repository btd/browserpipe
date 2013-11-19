var _ = require('lodash')

module.exports.isExtensionInstalled = function (callback) {
    //window.chrome.app.isInstalled does not work for extensions
    //Only way I found is this
    var self = this;
    if (!this.extensionInstalled) {
        var s = document.createElement('script');
        s.onload = function () {
            self.extensionInstalled = true;
            callback(true);
        };
        s.onerror = function () {
            self.extensionInstalled = true;
            callback(false);
        };
        s.src = 'chrome-extension://jhlmlfahjekacljfabgbcoanjooeccmm/manifest.json';
        document.body.appendChild(s);
    }
};

module.exports.installChromeExtension =  function () {
    var self = this;
    if (typeof window.chrome !== "undefined") {
        window.chrome.webstore.install(
            'https://chrome.google.com/webstore/detail/jhlmlfahjekacljfabgbcoanjooeccmm',
            function () {
                self.emit('extension.possible.installed');
                $('#installExtensionModal').modal('hide');
            },
            function () {
                //TODO: manage when it fails
            }
        );

    }
};

var sendMessageToExtension = function(eventName, data) {

    var customEvent = document.createEvent('Event');
    customEvent.initEvent(eventName, true, true);

    var hiddenDiv = document.getElementById('hiddenEventDiv');
    hiddenDiv.innerText = data
    hiddenDiv.dispatchEvent(customEvent);
    
    //TODO: good way to pass a message to extension:
    //http://krasimirtsonev.com/blog/article/Send-message-from-web-page-to-chrome-extensions-background-script
    //http://stackoverflow.com/questions/11431337/sending-message-to-chrome-extension-from-a-web-page
}
        
module.exports.focusTab = function(id) {
    var data = {
        id: parseInt(id, 10)
    };
    sendMessageToExtension('FocusTab', JSON.stringify(data));
};

module.exports.closeTabs = function(ids) {
    var data = {
        ids: _.map(ids, function(id){ return parseInt(id, 10);  })
    };
    sendMessageToExtension('CloseTabs', JSON.stringify(data));
}; 

module.exports.openTabs = function(win, urls) {
    var data = {
        win: win,
        urls: urls
    };
    //If window not defined, then a new window
    sendMessageToExtension('OpenTabs', JSON.stringify(data));
};

module.exports.closeTabs = function(ids) {
    var data = {
        ids: _.map(ids, function(id){ return parseInt(id, 10);  })
    };
    sendMessageToExtension('CloseTabs', JSON.stringify(data));
}; 


module.exports.openWindows = function() {
    var data = {
        //Not data
    };
    //If window not defined, then a new window
    sendMessageToExtension('OpenWindows', JSON.stringify(data));
};

module.exports.closeWindows = function(ids) {
    var data = {
        ids: _.map(ids, function(id){ return parseInt(id, 10);  })
    };
    sendMessageToExtension('CloseWindows', JSON.stringify(data));
}; 
