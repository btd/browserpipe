var manifests = {};

var fs = require('fs');
var http = require('http');
var url = require('url');

function loadManifest(manifestPath, prependUrl) {
  var manifest = manifests[manifestPath];
  if (!manifest) {
    try {
      manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    } catch (e) {
      manifest = {};
    }

    if (process.env.NODE_ENV != 'development') {
      manifests[manifestPath] = manifest;
    }
  }

  return {
    url: function (origUrl) {
      var parsedUrl = url.parse(origUrl);
      return prependUrl + '/' + (manifest[parsedUrl.pathname] || '404?url=' + encodeURIComponent(origUrl));
    }
  }
}

module.exports = loadManifest;
