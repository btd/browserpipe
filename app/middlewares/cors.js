var allowedOrigins = ['chrome-extension://bdmengenkddplhpffknebiahkofhcgkm']; //it is our chrome extension

//var allowedHeaders = ['X-Requested-With', 'Content-Type'].join(', ');

function checkOrigin(req, res){
    var origin = req.headers.origin;
    if(allowedOrigins.indexOf(origin) < 0) {
        res.end();
        return false;
    }
    res.setHeader('Access-Control-Allow-Origin', origin);
    return true;
}

function checkMethod(method, req, res) {
    var requestMethod = req.headers['access-control-request-method'];
    if(requestMethod) {
        if(method === requestMethod.toLowerCase()) {
            res.setHeader('Access-Control-Allow-Methods', requestMethod);
        } else {
            res.end();
            return false;
        }
    }
    return true;
}

function checkHeaders(req, res) {
    var headers = req.headers['access-control-request-headers'];
    if(headers) {
        res.setHeader('Access-Control-Allow-Headers', headers);
    }
    return true;
}

function checkCredentials(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    return true;
}

module.exports.CORS = function(app, method, url) {
    method = method.toLowerCase();
    var args = Array.prototype.slice.call(arguments, 3);
    app.options(url, function(req, res) {
        if(checkOrigin(req, res) &&
            checkMethod(method, req, res) &&
            checkHeaders(req, res) &&
            checkCredentials(req, res)) {
            res.send(204);
        }
    });
    args.unshift(function(req, res, next) {
        if(checkOrigin(req, res) &&
            checkCredentials(req, res)) {
            next();
        }
    });
    args.unshift(url);
    app[method.toLowerCase()].apply(app, args);
}


module.exports.allowAllAccess = function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", req.get('origin'));
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
  next();
}

