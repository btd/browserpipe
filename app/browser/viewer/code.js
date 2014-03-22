// this one used to show some text as is

function tpl(code) {
  return '<!doctype html>' +
    '<html>' +
    '<head>' +
    '</head>' +
    '<body>' +
    '<pre>' +
    '<code>' +
    code +
    '</code>' +
    '</pre>' +
    '</body>' +
    '</html>'
}

module.exports = function(text, callback) {
  return callback(null, tpl(text));
}