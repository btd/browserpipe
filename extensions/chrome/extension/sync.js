

function XhrError(message, status) {
    Error.call(this);

    this.name = 'XhrError';
    this.message = message;
    this.status = status;
}

XhrError.prototype = Object.create(Error.prototype);

function noop() { }

function xhr(options, callback, errback) {
    var req = new XMLHttpRequest();

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

var listboarditAuth = new OAuth2('listboard_it', {
    client_id: 'c1ac6c64c0e5b3d89742ca0b0c21f17a6ad09653cbc5485445205ff62d46f744b653edbcf44a789a7c08d46878fba68dc039a56eda99104bc2de8a6a953bf217',
    client_secret: '0010b153d6ab89f94ada6650745c2ec579de72cf41facdc0441f20cf6d080aacd3d9dd302886cbc8bb78fc067805bd65a2f7ab1fdc2ca93ef5b4eaf2d94e54f6'
});

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
    //sync();
})
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    //sync();
})
chrome.tabs.onMoved.addListener(function(tabId, moveInfo) {
    //sync();
})
chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
    //sync();
})

//bind window events
chrome.windows.onCreated.addListener(function(win) {
    //sync();
})
chrome.windows.onRemoved.addListener(function(winId) {
    //sync();
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