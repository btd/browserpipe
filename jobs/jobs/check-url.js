var request = require('superagent');

var Job = require('../job'),
    utils = require('../utils');

/**
 * Check if url is html page. Make HEAD request and check Content-Type header to be html.
 * @param {String|Object} options
 * @param instance - instance of job in kue
 * @param jobs - manager of jobs
 * @constructor
 */
var CheckUrlJob = function (options, instance, jobs) {
    Job.call(this, options, instance, jobs);

    this.uri = options.uri;
    this.uniqueId = options.uniqueId || utils.uid(24);
    this.userAgent = options.userAgent || utils.userAgent.default;

    if (!this.uri) throw new Error('uri required');
    //if (!this.uniqueId) throw new Error('uniqueId required');
};

CheckUrlJob.prototype = Object.create(Job.prototype);

CheckUrlJob.prototype.name = 'check-url';

CheckUrlJob.prototype.constructor = CheckUrlJob;

CheckUrlJob.prototype.exec = function (done) {
    var that = this;

    request
        .head(this.uri)
        .set('User-Agent', this.userAgent)
        .end(function (err, res) {

            if (err) return done(err);

            var mime = res.headers['content-type'];

            that.log('Got request check content-type: ' + mime);

            var sc = (mime || '').indexOf(';');
            if (sc > 0) mime = mime.substring(0, sc);

            if (utils.isHtmlContentType(mime)) {
                that.log('Html content - schedule download');
                that.jobs.schedule('download-html', { uri: that.uri, uniqueId: that.uniqueId })
                    .on('complete', function () {
                        done();
                    });
            }
            else
                done();

            //TODO we can download probably not big pdfs, texts

        })
};

module.exports = CheckUrlJob;