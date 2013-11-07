var Job = require('../job'),
    utils = require('../utils');

var cheerio = require('cheerio'),
    URL = require('URIjs'),
    url = require('url'),
    _ = require('lodash');

var path = require('path'),
    fs = require('fs');

/**
 * Check if url is html page. Make HEAD request and check Content-Type header to be html.
 * @param {String|Object} options
 * @param instance - instance of job in kue
 * @param jobs - manager of jobs
 * @constructor
 */
var ProcessHtmlJob = function (options, instance, jobs) {
    Job.call(this, options, instance, jobs);

    this.uri = options.uri;
    this.path = options.path;
    this.uniqueId = options.uniqueId;

    this.favicon = true;
    this.styles = false;
    this.images = false;
    this.js = false;

    if (!this.uri) throw new Error('uri required');
    if (!this.path) throw new Error('path required');
    if (!this.uniqueId) throw new Error('uniqueId required');
};

ProcessHtmlJob.prototype = Object.create(Job.prototype);

ProcessHtmlJob.prototype.name = 'process-html';

ProcessHtmlJob.prototype.constructor = ProcessHtmlJob;

ProcessHtmlJob.prototype.exec = function (done) {
    var that = this;

    var addDownload = function(url, path, uniqueId) {
        that.jobs.schedule('download', { uri: url, path: path, uniqueId: uniqueId });
    };

    //TODO we can download and interpret scripts, but if server does not support cors this, will not help at all

    if(this.favicon || this.styles || this.images || this.js) {
        fs.readFile(this.path, function(err, data) {
            if (err) return done(err); // rethrow to try restart job

            var $ = cheerio.load(data);

            var link = $('link[rel="icon"],link[rel="shortcut icon"],link[rel="apple-touch-icon"]');
            var href = link.attr('href');

            //We try convention URL if not found
            if(!href)
                href = that.uri + '/favicon.ico';

            var baseUrl = URL(that.uri);
            var _faviconUrl = URL(href);
            if(!_faviconUrl.protocol().length) _faviconUrl.protocol(baseUrl.protocol());
            if(!_faviconUrl.host().length) _faviconUrl.host(baseUrl.host());
            if(_faviconUrl.path()[0] !== '/') faviconUrl.directory(baseUrl.directory());

            var faviconUrl = _faviconUrl.toString();
            var faviconPath = path.resolve(path.dirname(that.path), 'favicon.ico');
            that.log('favicon %s %s', faviconUrl, faviconPath);

            that.log('faviconUrl:  ' + faviconUrl)
            that.log('faviconPath:  ' + faviconPath)

            addDownload(faviconUrl, faviconPath);

            $('script,object,iframe,audio,video').remove();
            $('[onclick]').removeAttr('onclick');

            fs.writeFile(that.path + '.buf', $.html(), function(err) {

                if (err) return done(err);

                fs.unlink(that.path, function(err) {

                    if (err) return done(err);

                    fs.rename(that.path + '.buf', that.path, function(err) {

                        if (err) return done(err);

                        that.log('file ' + that.path + ' processed');

                        done();
                    });

                });
            });

            done();
        });

    }
};

module.exports = ProcessHtmlJob;
