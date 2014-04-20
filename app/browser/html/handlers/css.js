var Promise = require('bluebird');

var util = require('../../util');

/*
 This function take on downloaded css and attributes, then
 0. Remove @charset at the begining
 1. Replace all url to absolute
 2. Resolve all imported css with its actual content
 3. Combine all chunks to one file
 */
function process(body, attr, browser) {
  var media = attr.media || 'all';

  //remove charset
  var content = util.removeStyleCharset(body.content);
  var urlReplacer = util.makeUrlReplacer(body.href);

  //make url(...) absolute
  content = util.replaceStyleUrl(content, urlReplacer);

  if (media && media != 'all') {
    content = '@media ' + media + ' { ' + content + ' } ';// css3 allow @media query nesting http://www.w3.org/TR/css3-conditional/#processing
  }

  return Promise.all(util.splitStyleByImport(content, function (url, media) {
    url = urlReplacer(url);//make absolute if not
    return browser._loadUrlOnly(url)
      .then(function (data) {
        return process(data, { media: media }, browser)
      })
  })).then(function (chunks) {
    return chunks.join('');
  });
}
exports.process = process;