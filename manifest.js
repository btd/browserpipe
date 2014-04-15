var manifests = {};
var Url = require('url');
function loadManifest(manifestPath, prependUrl) {
    var manifest = manifests[manifestPath];
    if(!manifest) {
        try {
            manifest = require(manifestPath);
        } catch(e) {
            manifest = {};
        }
    }

    return {
        url: function(origUrl) {
            var parsedUrl = Url.parse(origUrl);
            return prependUrl + '/' + (manifest[parsedUrl.pathname] || '404?url=' + encodeURIComponent(origUrl));
        }
    }
}

module.exports = loadManifest;