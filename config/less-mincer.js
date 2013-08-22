// this can be published to npm
var Mincer = require('mincer'),
    LessEngine = Mincer.LessEngine,
    less = require('less');

var installLessSupport = function(environment) {
    ['image', 'video', 'audio', 'font', 'javascript', 'stylesheet'].forEach(function(assetType) {
        environment.ContextClass.registerHelper(assetType + '_url', function(pathname) {
            return "url('" + this[assetType + 'Path'](pathname) + "')";
        });
    });
};

module.exports = installLessSupport;