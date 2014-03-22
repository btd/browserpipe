// this one used to show some text as is

function tpl(url) {
  return '<!doctype html>' +
    '<html>' +
    '<head>' +
    '</head>' +
    '<body>' +
    '<img src="'+url +'">' +
    '</body>' +
    '</html>'
}

module.exports = function(url, callback) {
  return callback(null, { content: tpl(fixedEncodeURI(url)) });
}

function fixedEncodeURI (str) {
  return encodeURI(str).replace(/%5B/g, '[').replace(/%5D/g, ']');
}