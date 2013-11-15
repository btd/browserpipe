
var sendMessageToExtension = function(name) {

    var args = Array.prototype.slice.call(arguments, 1);
    console.log('executing ' + arguments[0] + ':' + args);

    //TODO: good way to pass a message to extension:
    //http://krasimirtsonev.com/blog/article/Send-message-from-web-page-to-chrome-extensions-background-script
    //http://stackoverflow.com/questions/11431337/sending-message-to-chrome-extension-from-a-web-page

}

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
        
module.exports.focusTab = function(id) {
    sendMessageToExtension('focusTab', id);
};

module.exports.closeTabs = function(ids) {
    sendMessageToExtension('CloseTabs', ids);
}; 

module.exports.openTabs = function(window, url) {
    //If window not defined, then a new window
    sendMessageToExtension('OpenTabs', window, url);  
};