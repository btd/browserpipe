var request = require('superagent'),
    mkdirp = require('mkdirp'),
    URL = require('URIjs');

var fs = require('fs'),
    path = require('path');

var DonwloadJob = require('./download');

//TODO need test timeouts and redirects
//TODO need way to specify headers, maybe from extension
var DownloadHtmlJob = function (options, instance, jobs) {
    DonwloadJob.call(this, options, instance, jobs);
};

DownloadHtmlJob.prototype = Object.create(DonwloadJob.prototype);

DownloadHtmlJob.prototype.constructor = DownloadHtmlJob;

DownloadHtmlJob.prototype.exec = function (done) {
    var that = this;
    DonwloadJob.prototype.exec.call(this, function() {
        that.log('Html content - schedule processing');
        that.jobs.schedule('process-html', { uri: that.uri, path: that.path });

        done();
    });
};

module.exports = DownloadHtmlJob;