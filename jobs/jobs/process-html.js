var Job = require('../job'),
    utils = require('../utils');

var jsdom = require('jsdom'),
    URL = require('URIjs'),
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

ProcessHtmlJob.prototype.constructor = ProcessHtmlJob;

ProcessHtmlJob.prototype.exec = function (done) {
    var that = this;

    var addDownload = function(url, path, uniqueId) {
        that.jobs.schedule('download', { uri: url, path: path, uniqueId: uniqueId });
    };

    var removeAllTags = function(window, tagName) {
        var tags = window.document.getElementsByTagName(tagName);

        //remove scripts at all
        _.each(tags, function(tag) {
            tag.parentNode.removeChild(tag);
        });

        that.log(tagName + ' removed');
    };

    //TODO we can download and interpret scripts, but if server does not support cors this, will not help at all

    if(this.favicon || this.styles || this.images || this.js) {
        jsdom.env({
            url: this.uri,
            path: this.path,
            uniqueId: this.uniqueId,
            done: function(err, window) {
                
                if (err) return done(err);

                var links = window.document.getElementsByTagName('link');

                that.log('found links', links.length);

                _.each(links, function(link) {
                    switch(link.getAttribute('rel')) {
                        case 'icon':
                        case 'shortcut icon':
                            var href = link.getAttribute('href');

                            var _url = (new URL(href)).relativeTo(that.uri);
                            if(!_url.protocol()) _url.protocol('http');

                            var faviconUrl = _url.toString();
                            var faviconPath = path.resolve(path.dirname(that.path), _url.filename());
                            that.log('favicon', faviconUrl, faviconPath);

                            link.setAttribute('href', _url.filename());

                            addDownload(faviconUrl, faviconPath);

                            break;
                    }
                });

                removeAllTags(window, 'script');
                removeAllTags(window, 'object');
                removeAllTags(window, 'iframe');
                removeAllTags(window, 'audio');
                removeAllTags(window, 'video');
                //TODO need to review which we should delete also

                //TODO need to remove a[href=^javascript:], [on*=]

                //now save changed file near old
                //TODO it seems better to use write stream there
                fs.writeFile(that.path + '.buf', window.document.doctype + window.document.innerHTML, function(err) {
                    
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

                window.close();
            }
        });
    }
};

module.exports = ProcessHtmlJob;
