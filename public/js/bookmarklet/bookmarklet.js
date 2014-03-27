var xhr = new XMLHttpRequest();
xhr.open('POST', BROWSERPIPE_DOMAIN + '/add',true);
xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
xhr.withCredentials = true ;
xhr.onreadystatechange = function(e) {};
var url = encodeURI(document.URL);
var width = encodeURI(document.documentElement.clientWidth);
var height = encodeURI(document.documentElement.clientHeight);
var html = encodeURI(document.documentElement.innerHTML);
xhr.send('url=' + url + '&html=' + html + '&width=' + width + '&height=' + height)
//Keep this code for the future
//setTimeout(function(){var ww = window.open(window.location, '_self'); ww.close(); }, 1000);
