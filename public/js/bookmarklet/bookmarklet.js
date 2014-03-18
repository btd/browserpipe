var xhr = new XMLHttpRequest();
xhr.open('POST', BROWSERPIPE_DOMAIN + '/add',true);
xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
xhr.withCredentials = true ;
xhr.onreadystatechange = function(e) {};
var url = encodeURIComponent(document.URL);
var width = encodeURIComponent(document.documentElement.clientWidth);
var height = encodeURIComponent(document.documentElement.clientHeight);
var html = encodeURIComponent(document.documentElement.innerHTML);
xhr.send('url=' + url + '&html=' + html + '&width=' + width + '&height=' + height)
setTimeout(function(){var ww = window.open(window.location, '_self'); ww.close(); }, 1000);
