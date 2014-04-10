var xhr = new XMLHttpRequest();
xhr.open('POST', BROWSERPIPE_DOMAIN + '/add',true);
xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
xhr.withCredentials = true ;
xhr.onreadystatechange = function(e) {};
function encode(data) {return encodeURIComponent(data).replace(/%20/g, '+');}
var url = encode(document.URL);
var width = document.documentElement.clientWidth;
var height = document.documentElement.clientHeight;
var html = encode(document.documentElement.innerHTML);
var charset = encode(document.characterSet);
xhr.send('url=' + url + '&html=' + html + '&charset=' + charset + '&width=' + width + '&height=' + height)
//Keep this code for the future
//setTimeout(function(){var ww = window.open(window.location, '_self'); ww.close(); }, 1000);
