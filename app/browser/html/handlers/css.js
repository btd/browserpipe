var Promise = require('bluebird');

var util = require('../../util');

/*
 This function take on downloaded css and attributes, then
 0. Remove @charset at the begining
 1. Replace all url to absolute
 2. Resolve all imported css with its actual content
 3. Combine all chunks to one file
 */
//TODO check if css on another domain urls replaced correctly
function process(body, attr, browser) {
  var media = attr.media || 'all';

  //remove charset
  var content = util.removeStyleCharset(body.content);

  //make url(...) absolute
  content = util.replaceStyleUrl(content, util.makeUrlReplacer(body.href));

  if (media && media != 'all') {
    content = '@media ' + media + ' { ' + content + ' } ';// css3 allow @media query nesting http://www.w3.org/TR/css3-conditional/#processing
  }

  return Promise.all(util.splitStyleByImport(content, function (url) {
    return browser._loadUrl(url)
      .then(function (data) {
        return process(data, {}, browser)
      })
  })).then(function (chunks) {
    return chunks.join('');
  });
}

exports.process = process;