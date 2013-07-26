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

    var originalLessEvaluate = LessEngine.prototype.evaluate;

    LessEngine.prototype.evaluate = function (context, locals) {

        var localNames = Object.keys(locals);

        // add locals to less functions
        localNames.forEach(function(local) {
            less.tree.functions[local] = function(lessArg) {
                return new less.tree.Anonymous(locals[local](lessArg.value));
            }
        });

        var result = originalLessEvaluate.call(this, context);

        //remove locals from less functions

        localNames.forEach(function(local) {
            delete less.tree.functions[local];
        });

        return result;
    }
};

module.exports = installLessSupport;