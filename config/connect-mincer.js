// this thing can be published
var Mincer = require('mincer'),
    url = require('url'),
    path = require('path'),
    _ = require('lodash');

var checkMissingProperty = function(options, property) {
    if(!options[property]) throw new Error('Property ' + property + ' required');
};

var rewriteExtension = function (source, ext) {
    return (!ext || path.extname(source) === ext) ? source : (source + ext);
};

var makeTag = function(name, attributes, selfClose, sanitaze) {
    var tag = '<' + name;
    Object.keys(attributes).forEach(function(attrName) {
        tag += ' ' + attrName + '="' +  attributes[attrName] + '"';
    });

    tag += selfClose ? sanitaze ? '>' : '/>' : '></' + name + '>';
    return tag;
};

var ConnectMincer = function(options) {
    if(!options) throw new Error('Missing options');
    checkMissingProperty(options, 'roots');
    checkMissingProperty(options, 'url');

    var that = this;

    //first normalize config
    if(typeof options.roots === 'string')
        options.roots = [options.roots];

    this.options = options;

    this.environment = new Mincer.Environment();
    options.roots.forEach(function(root) {
        this.environment.appendPath(root);
    }, this);

    if(options.cache)
        this.environment.cache = new Mincer.FileStore(options.cache);

    this.environment.ContextClass.defineAssetPath(function (pathname, options) {
        var assetPath = that._findAssetPaths(pathname, options)[0];

        if (!assetPath) {
            throw new Error("File " + pathname + " not found");
        }
        return assetPath;
    });

    if(options.preprocess) {
        this.environment.jsCompressor  = "uglify";
        this.environment.cssCompressor = "csso";

        //assets will not changed between requests
        this.environment = this.environment.index;

        this.manifest = new Mincer.Manifest(this.environment, options.manifest);
    }
};

ConnectMincer.prototype.preprocess = function() {
    if(this.options.preprocess) {
        var that = this;
        this.manifest.compile(this.options.preprocess, function(err) {
            if(err) console.warn('Error while preprocess assets', err);
            else console.info('Assets compiled', that.options.preprocess);
        });
    }
};

ConnectMincer.prototype._findAssetPaths = function (logicalPath, options, ext) {
    var parsedUrl = _.pick(url.parse(logicalPath, true), 'query', 'hash', 'pathname');
    logicalPath = parsedUrl.pathname;

    var assetInManifest = this.manifest && this.manifest.assets[logicalPath];
    if(assetInManifest) {
        parsedUrl.pathname = this.options.url + '/' + rewriteExtension(assetInManifest, ext);
        return [ url.format(parsedUrl) ];
    }

    var asset = this.environment.findAsset(logicalPath, options);

    return asset && asset.toArray().map(function(dep) {
        parsedUrl.pathname = this.options.url + '/' + rewriteExtension(dep.logicalPath, ext);
        parsedUrl.query.body = '1';
        return url.format(parsedUrl);
    }, this);
};

ConnectMincer.prototype.middleware = function() {
    var that = this;
    return function(req, res, next) {
        if (res.locals) {
            res.locals.stylesheet_tag = that.stylesheet_tag.bind(that);
            res.locals.javascript_tag = that.javascript_tag.bind(that);
            res.locals.image_tag = that.image_tag.bind(that);
        }

        next();
    };
};

ConnectMincer.prototype.stylesheet_tag = function(path, attributes) {
    var assetPaths = this._findAssetPaths(path, {}, '.css');

    attributes = _.defaults(attributes || {}, {
        rel: "stylesheet",
        type :"text/css"
    });
    return (assetPaths && assetPaths.map(function(assetPath) {
        return makeTag('link', _.extend(attributes, { href: assetPath }), true, true);
    }).join('\n')) || makeTag('link', _.extend(attributes, { href: path }), true, true);;
};

ConnectMincer.prototype.javascript_tag = function(path, attributes) {
    var assetPaths = this._findAssetPaths(path, {}, '.js');

    attributes = _.defaults(attributes || {}, {
        type :"text/javascript"
    });

    return (assetPaths && assetPaths.map(function(assetPath) {
        return makeTag('script', _.extend(attributes, { src: assetPath }));
    }).join('\n')) || makeTag('script', _.extend(attributes, { src: path }));;
};

ConnectMincer.prototype.image_tag = function(path, attributes) {
    var assetPaths = this._findAssetPaths(path, {});

    return (assetPaths && assetPaths.map(function(assetPath) {
        return makeTag('img', _.extend(attributes, { src: assetPath }));
    }).join('\n')) || makeTag('img', _.extend(attributes, { src: path }));;
};

ConnectMincer.prototype.createServer = function() {
    return Mincer.createServer(this.environment, this.manifest);
};

module.exports = ConnectMincer;