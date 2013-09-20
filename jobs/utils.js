
// some last user-agents
var userAgent = {
    chrome: 'Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.17 Safari/537.36',
    ff: 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:25.0) Gecko/20100101 Firefox/25.0',
    ie: 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; WOW64; Trident/6.0)'
};

userAgent.default = userAgent.chrome;

exports.userAgent = userAgent;

exports.isHtmlContentType = function(mime) {
    return mime === 'text/html';
};

exports.uid = function(len){
    var buf = '';
    var chars = 'abcdefghijklmnopqrstuvwxyz123456789';
    var nchars = chars.length;
    while (len--) buf += chars[Math.random() * nchars | 0];
    return buf;
};