module.exports =
function send(options) {
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest;
    xhr.addEventListener("error", reject);
    xhr.addEventListener("load", resolve);

    xhr.open(options.method || 'GET', options.url, true);

    Object.keys(options.headers || {}).forEach(function (key) {
      xhr.setRequestHeader(key, options.headers[key]);
    });

    xhr.send(options.data || void 0);
  }).then(function(evt) {
    return [evt.target.response, evt.target.status ];
  });
};