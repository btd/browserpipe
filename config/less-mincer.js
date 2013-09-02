var installLessSupport = function(environment) {
    ['image', 'video', 'audio', 'font', 'javascript', 'stylesheet'].forEach(function(assetType) {
        environment.ContextClass.registerHelper(assetType + '_url', function(pathname) {
            return "url('" + this[assetType + 'Path'](pathname) + "')";
        });
    });
};

module.exports = installLessSupport;