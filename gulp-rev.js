'use strict';
var crypto = require('crypto');
var path = require('path');
var gutil = require('gulp-util');
var through = require('through2');

function md5(str) {
    return crypto.createHash('md5').update(str, 'utf8').digest('hex');
}

function relPath(base, filePath) {
    if (filePath.indexOf(base) !== 0) {
        return filePath;
    }
    var newPath = filePath.substr(base.length);
    if (newPath[0] === path.sep) {
        return newPath.substr(1);
    } else {
        return newPath;
    }
}

var plugin = function () {
    return through.obj(function (file, enc, cb) {
        if (file.isNull()) {
            this.push(file);
            return cb();
        }

        if (file.isStream()) {
            this.emit('error', new gutil.PluginError('gulp-rev', 'Streaming not supported'));
            return cb();
        }

        // save the old path for later
        file.revOrigPath = file.path;
        file.revOrigBase = file.base;

        var hash = md5(file.contents.toString());
        var ext = path.extname(file.path);
        var filename = path.basename(file.path, ext) + '-' + hash + ext;
        file.path = path.join(path.dirname(file.path), filename);
        this.push(file);
        cb();
    });
};

plugin.manifest = function (options) {
    var manifest = {};
    options.cwd = options.cwd || process.cwd();
    options.manifestPath = path.resolve(options.cwd, options.manifestPath);
    options.from = path.resolve(options.cwd, options.from);
    options.to = path.resolve(options.cwd, options.to);

    try {
        manifest = require(options.manifestPath);
    } catch(e) {}

    return through.obj(function (file, enc, cb) {
        // ignore all non-rev'd files
        if (file.path && file.revOrigPath) {
            manifest[relPath(options.from, file.revOrigPath)] = relPath(options.to, file.path);
        }

        cb();
    }, function (cb) {
        this.push(new gutil.File({
            cwd: options.cwd,
            path: options.manifestPath,
            base: path.dirname(options.manifestPath),
            contents: new Buffer(JSON.stringify(manifest, null, ' '))
        }));

        cb();
    });
};

module.exports = plugin;