var listboarditAuth = new OAuth2('listboard_it', {
    client_id: 'c1ac6c64c0e5b3d89742ca0b0c21f17a6ad09653cbc5485445205ff62d46f744b653edbcf44a789a7c08d46878fba68dc039a56eda99104bc2de8a6a953bf217',
    client_secret: '0010b153d6ab89f94ada6650745c2ec579de72cf41facdc0441f20cf6d080aacd3d9dd302886cbc8bb78fc067805bd65a2f7ab1fdc2ca93ef5b4eaf2d94e54f6'
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


// bind to click on extension button if i understand right
chrome.browserAction.onClicked.addListener(function (tab) {
    listboarditAuth.authorize(function() {

        // Ready for action, can now make requests with
        var access_token = listboarditAuth.getAccessToken();

        xhr({
            url: 'http://api.local.listboard.it:4001/v1/token?access_token=' + access_token,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }, function(data) {
            console.log(data);
        });
    });
});

