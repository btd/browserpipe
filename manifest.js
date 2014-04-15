var manifests = {};
var Url = require('url');
var Fs = require('fs');

function loadManifest(manifestPath, prependUrl) {
    var manifest = manifests[manifestPath];
    if(!manifest) {
        try {
            manifest = JSON.parse(Fs.readFileSync(manifestPath, 'utf8'));
            if(manifests[manifestPath] && process.env.NODE_ENV != 'development') {
                manifests[manifestPath] = manifest;
            }
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