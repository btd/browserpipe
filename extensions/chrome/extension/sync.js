var listboarditAuth = new OAuth2('listboard_it', {
    client_id: '459043952b1b9d51fab2bf0cc018353cd121609236e03273c378172e52b7f601ff20d79345b78e358bad0024ccd785b2a8a0e39817327a386628f68dc71ef464',
    client_secret: 'dcb37d3bed34e05a31d84000aa0f823e5344b4f635c9402b6cdd8817ee9eed1bdc08daac536a0eeac98e8d232e4f4b3cff420aaf9e56db8da6bbaac333b3f62c'
});

var xobj = function(){
    return new XMLHttpRequest();
};

function XhrError(message, status) {
    Error.call(this);

    this.name = 'XhrError';
    this.message = message;
    this.status = status;
}

XhrError.prototype = Object.create(Error.prototype);

function noop() { }

function xhr(options, callback, errback) {
    var req = xobj();

    if(Object.prototype.toString.call(options) == '[object String]') {
        options = { url: options };
    }

    req.open(options.method || 'GET', options.url, true);

    if(options.credentials) {
        req.withCredentials = true;
    }

    options.headers = options.headers || {};

    for(var header in options.headers) {
        req.setRequestHeader(header, options.headers[header]);
    }

    req.onreadystatechange = function() {
        if(req.readyState != 4) return;

        if([
            200,
            304,
            0
        ].indexOf(req.status) === -1) {
            (errback || noop)(new XhrError('Server responded with a status of ' + req.status, req.status));
        } else {
            (callback || noop)(req);
        }
    };

    req.send(options.data || void 0);
}

function generateRandomKey() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function browserKey() {
    var key = localStorage["browser_listboard_unique_key"];

    if (!key) {
        key = generateRandomKey();
        localStorage["browser_listboard_unique_key"] = key;
    }
    return key;
}

var sync = function() {
    listboarditAuth.authorize(function() {

        // Ready for action, can now make requests with
        var access_token = listboarditAuth.getAccessToken();

        var key = browserKey();

        var url = 'http://api.local.listboard.it:4001/v1/browsers/' + key + '?access_token=' + access_token;

        chrome.windows.getAll({populate: true}, function (windows) {

            /* Will send this data to the server
            { windows: [  {  externalId:,  tabs:[ { externalId:, url:, title:, favicon: }] } ] }*/

            var result = {
                browserName: 'chrome',
                windows: []
            }
            for (var i = 0; i < windows.length; i++) {
                var win = {
                    externalId: windows[i].id,
                    tabs: []
                }
                for (var j = 0; j < windows[i].tabs.length; j++) {
                    var tab = {
                        externalId: windows[i].tabs[j].id,
                        url: windows[i].tabs[j].url,
                        title: windows[i].tabs[j].title,
                        favicon: windows[i].tabs[j].favIconUrl
                    }
                    win.tabs.push(tab);
                }
                result.windows.push(win);
            }

            xhr({
                url: url,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify(result)
            }, function(data) {
                //console.log(data);
            });
        });


    });
}


// bind to click on extension button if i understand right
chrome.browserAction.onClicked.addListener(function (tab) {
    sync();
});

//bind tab events
chrome.tabs.onCreated.addListener(function(tab) {
    sync();
})
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    sync();
})
chrome.tabs.onMoved.addListener(function(tabId, moveInfo) {
    sync();
})
chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
    sync();
})

//bind window events
chrome.windows.onCreated.addListener(function(win) {
    sync();
})
chrome.windows.onRemoved.addListener(function(winId) {
    sync();
})

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {  
    switch(message.name){
        case 'FocusTab': {
            chrome.tabs.get(message.id, function(tab){
                chrome.tabs.update(tab.id, {active: true});    
                chrome.windows.update(tab.windowId, {focused: true});    
            });            
            break;
        }
        case 'OpenTabs': {
            alert(message);
            break;
        }
        case 'CloseTabs': {
            chrome.tabs.remove(message.ids, function() {
                sync();
            })
            break;
        }
        case 'OpenWindow': {
            alert(message);
            break;
        }
        case 'CloseWindow': {            
            chrome.windows.remove(message.id, function() {
                //We wait 2 seconds for fully closed
                setTimeout(function(){
                  sync();
                },1000);                
            })
            break;
        }        
        default: alert('no data')
    }
    return true;
});