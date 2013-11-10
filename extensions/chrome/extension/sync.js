var listboarditAuth = new OAuth2('listboard_it', {
    client_id: 'd1252f6f84b7a7369fcd600c59ff3b8965d77b6ea6554aee98e42c717003c1f724de7a4c2840c4db3860627f1b483eb6dc0088bb5914cac3e3d249d4e61cbaf2',
    client_secret: '2fb1a00cdcc13060e1d450fad35616b749e1a5b6692b06e4273a955bcd4efc8ffb32aabbe098ef3b0c62f5d236cfc6361517a601cf49a0ee012687dc37f6fa77'
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

