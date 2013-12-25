function XhrError(message, status) {
    Error.call(this);

    this.name = 'XhrError';
    this.message = message;
    this.status = status;
}

XhrError.prototype = Object.create(Error.prototype);

function noop() {
}

function xhr(options, callback) {
    var req = new XMLHttpRequest();

    if (Object.prototype.toString.call(options) == '[object String]') {
        options = { url: options };
    }

    req.open(options.method || 'GET', options.url, true);

    if (options.credentials) {
        req.withCredentials = true;
    }

    options.headers = options.headers || {};
    options.headers['X-Requested-With'] = 'XMLHttpRequest';

    for (var header in options.headers) {
        req.setRequestHeader(header, options.headers[header]);
    }

    req.withCredentials = true;

    req.onreadystatechange = function () {
        if (req.readyState != 4) return;

        if ([
            200,
            304,
            0
        ].indexOf(req.status) === -1) {
            callback(new XhrError('Server responded with a status of ' + req.status, req.status));
        } else {
            callback(null, req.responseText);
        }
    };

    req.send(options.data || void 0);
}

// looks like UUID v4
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

var enc = encodeURIComponent;

function queryString(query) {
    var result = [];
    for (var param in query) {
        result.push(enc(param) + '=' + enc(query[param]));
    }
}

function Api(options) {
    this.options = options;
    this.key = browserKey();
}

Api.prototype = {
    _post: function (url, query, data, callback) {
        var qs = queryString(query);
        xhr({
            url: this.options.baseUrl + '/api/v1/browsers/' + this.key + url + (qs ? '?' + qs : ''),
            method: 'POST',
            data: data,
            headers: {
                'Content-Type': 'application/json'
            }
        }, callback)
    },

    syncBrowser: function (data, callback) {
        this._post('', {}, JSON.stringify(data), callback);
    },

    saveForLater: function(data, callback) {
        this._post('/later', {}, JSON.stringify(data), callback);
    },

    openLoginPage: function() {
        chrome.tabs.create({ url: this.options.baseUrl + '/login' });
    }
}

var baseUrl = 'http://localhost:4000';
var client = new Api({ baseUrl: baseUrl });

var sync = function () {
    chrome.windows.getAll({ populate: true }, function (windows) {

        /* Will send this data to the server
         { windows: [  {  externalId:,  tabs:[ { externalId:, url:, title:, favicon: }] } ] }*/

        var result = {
            browserName: 'chrome', //TODO we can take this from UA
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

        client.syncBrowser(result, function(err, res) {
            if(err) {
                if(err.status === 401) { //open
                    client.openLoginPage();
                }
            } else {
                console.log(res);
            }
        });
    });
}


// bind to click on extension button if i understand right
chrome.browserAction.onClicked.addListener(function (tab) {
    sync();
});

/*
For selection - to create note e.g
not enough to use context 'selection' in this case selectedText will contain plain text - not a html markup
to get html we need to get window and get from it selection via getSelection, findSelection etc
main thing that it is resolvable
 */

var contextMenuId = chrome.contextMenus.create({
    "title": "Save for later",
    "contexts":["link"],
    "onclick": function(info, tab) {
        var item;
        if(info.linkUrl) { //save link, for selection it will be selectionText
            item = {
                url: info.linkUrl,
                page: info.pageUrl,
                type: 0
            };
        }
        if(item) {
            client.saveForLater(item, function(err, res) {
                if(err) {
                    if(err.status === 401) { //open
                        client.openLoginPage();
                    }
                } else {
                    console.log(res);
                }
            })
        }
    }
});

/*
//bind tab events
chrome.tabs.onCreated.addListener(function (tab) {
    //sync();
})
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    //sync();
})
chrome.tabs.onMoved.addListener(function (tabId, moveInfo) {
    //sync();
})
chrome.tabs.onRemoved.addListener(function (tabId, removeInfo) {
    //sync();
})

//bind window events
chrome.windows.onCreated.addListener(function (win) {
    //sync();
})
chrome.windows.onRemoved.addListener(function (winId) {
    //sync();
})
*/
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    switch (message.name) {
        case 'FocusTab':
        {
            chrome.tabs.get(message.id, function (tab) {
                chrome.tabs.update(tab.id, {active: true});
                chrome.windows.update(tab.windowId, {focused: true});
            });
            break;
        }
        case 'OpenTabs':
        {
            alert(message);
            break;
        }
        case 'CloseTabs':
        {
            chrome.tabs.remove(message.ids, function () {
                sync();
            })
            break;
        }
        case 'OpenWindow':
        {
            alert(message);
            break;
        }
        case 'CloseWindow':
        {
            chrome.windows.remove(message.id, function () {
                //We wait 2 seconds for fully closed
                setTimeout(function () {
                    sync();
                }, 1000);
            })
            break;
        }
        default:
            alert('no data')
    }
    return true;
});