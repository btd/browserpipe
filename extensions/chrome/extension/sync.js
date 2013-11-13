var listboarditAuth = new OAuth2('listboard_it', {
    client_id: '4f7f61bfee670bf9d326f78c5866c1480ad3ecdc99a3485427ad798b6cf898002414753aee18fae0e85d6991c8843a1fcf5b8a9281c1d400ac347f2d505c44fa',
    client_secret: '1d8f24ac906662ea6932429bd16b7342170a6e054b72c899451ae90c9ecf8418289c1b82b5b833b0e5eaa3d719a6d227dafbc7b9c739d4260aacd29953f08005'
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

