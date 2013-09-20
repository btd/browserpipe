var screenshot = require('url-to-screenshot'),
    mkdirp = require('mkdirp');

var fs = require('fs'),
    path = require('path');

var config = require('../config'),
    utils = require('../utils'),
    Job = require('../job');

/**
 * Check if url is html page. Make HEAD request and check Content-Type header to be html.
 * @param {String|Object} options
 * @param instance - instance of job in kue
 * @param jobs - manager of jobs
 * @constructor
 */
var ScreenShotJob = function (options, instance, jobs) {
    Job.call(this, options, instance, jobs);

    this.uri = typeof options === 'string' ? options : options.uri;

    if (!this.uri) throw new Error('uri required');
};

ScreenShotJob.prototype = Object.create(Job.prototype);

ScreenShotJob.prototype.constructor = ScreenShotJob;

ScreenShotJob.prototype.exec = function (done) {
    var that = this;

    var format = config.screenshot.format || 'jpg';

    this.path = path.join(config.storePath, utils.uid(24), (config.screenshot.defaultName || 'screenshot') + '.' + format);

    screenshot(this.uri)
        .width(config.screenshot.width || 800)
        .height(config.screenshot.height || 600)
        .format(format)
        .capture(function(err, img) {
            if (err) throw err;

            mkdirp(path.dirname(that.path), function(err) {
                if(err) throw err;

                fs.writeFile(that.path, img, function(err) {
                    if(err) throw err;

                    that.log('Screenshot of ' + that.uri + ' saved '+ that.path);

                    done();
                });
            });
        });
};

module.exports = ScreenShotJob;
