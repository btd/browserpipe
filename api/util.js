var _ = require('lodash');


var urlAppendParams = function(url, params) {
    _.each(params, function(value, key) {
        url = urlAppendParam(url, key, value);
    });
    return url;
};

var urlAppendParam = function(url, paramName, paramValue) {
    var beginQuery = url.indexOf('?');
    var firstParam = url.indexOf('=', beginQuery);
    var param = encodeURIComponent(paramName) + '=' + encodeURIComponent(paramValue);
    return url + (beginQuery < 0 ? '?' + param :
        firstParam < 0 ? param : '&' + param);
};

module.exports.urlAppendParams = urlAppendParams;