var request = require('superagent'),
    mkdirp = require('mkdirp'),
    URL = require('URIjs');

var fs = require('fs'),
    path = require('path');

var Job = require('../job'),
    utils = require('../utils'),
    config = require('../../config');

//TODO need test timeouts and redirects
//TODO need way to specify headers, maybe from extension
var DownloadJob = function (options, instance, jobs) {
    Job.call(this, options, instance, jobs);

    this.uri = options.uri;
    this.path = options.path;
    this.uniqueId = options.uniqueId;

    this.userAgent = options.userAgent || utils.userAgent.default;

    if (!this.uri) throw new Error('uri required');
};

DownloadJob.prototype = Object.create(Job.prototype);

DownloadJob.prototype.name = 'download';

DownloadJob.prototype.constructor = DownloadJob;

DownloadJob.prototype.exec = function (done) {
    var that = this;

    var req = request
        .get(this.uri)
        .set('User-Agent', this.userAgent)
        .set('Accept-Encoding', 'gzip,deflate')//lets prefer gzip by default
        .end(function (err, res) {
            if (err) return done(err);
        });

    if(!this.path) {
        var filename = path.basename(new URL(this.uri).filename() || '/index.html');
        this.path = path.join(config.storePath, this.uniqueId, filename);
    }

    this.log('Prepare location for file: ' + this.path);
    //this.log(req.headers);

    mkdirp(path.dirname(this.path), function(err) {

        if (err) return done(err);

        var stream = fs.createWriteStream(that.path);

        req.pipe(stream);

        stream.on('finish', function() {
            that.log('Finish download: ' + that.path);

            done();
        })
    });
};

module.exports = DownloadJob;