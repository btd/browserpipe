(function (window, document, location, documentElement) {
  function encode(data) {
    return encodeURIComponent(data).replace(/%20/g, '+');
  }

  function post(path, params, method) {
    method = method || 'post';
    var xhr = new XMLHttpRequest();
    xhr.open(method, path, true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.withCredentials = true;
    var acc = [];
    for(var key in params) {
      if(params.hasOwnProperty(key)) {
        acc.push(encode(key)+ '=' +encode(params[key]));
      }
    }
    var body = acc.join('&');
    xhr.send(body);
  }

  post('<%= config.appUrl %>/add?next=back', {
    url: location.href,
    title: document.title,
    width: documentElement.clientWidth,
    height: documentElement.clientHeight,
    html: documentElement.outerHTML,
    charset: document.characterSet
  });

})(window, document, location, document.documentElement);