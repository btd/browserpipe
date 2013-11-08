var listboarditAuth = new OAuth2('listboard_it', {
    client_id: 'bfb3d6aa4fb7fd30d8ba8bbcda8ddf4257eb8e7c479aae81e10659ea09692a697c80f6e0dbb23e3a9a9d4ec777bee6dfcd0edb142afbac6d7df582672604d483',
    client_secret: 'd753a4c7711a34339bb5586b5c6059098aa65f132242e567f71a5a4b03949fd3aa37bd2e969b5e03c958ea201af3497270eb7233ed0645c49a9220c4c453cfa1'
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


// bind to click on extension button if i understand right
chrome.browserAction.onClicked.addListener(function (tab) {
    listboarditAuth.authorize(function() {

        // Ready for action, can now make requests with
        var access_token = listboarditAuth.getAccessToken();

        var key = browserKey();

        var url = 'http://api.local.listboard.it:4001/v1/browsers/' + key + '?access_token=' + access_token;

        chrome.windows.getAll({populate: true}, function (windows) {

            /*

             Will send this data to the server

             {
             windows: [
             {
             externalId:
             tabs:[
             {
             externalId:
             url:
             title:
             favicon:
             }
             ]
             }

             ]
             }*/

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
                console.log(data);
            });
        });


    });
});

