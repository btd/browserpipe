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

    this.uri = options.uri;
    this.uniqueId = options.uniqueId

    if (!this.uri) throw new Error('uri required');
    if (!this.uniqueId) throw new Error('uniqueId required');
};

ScreenShotJob.prototype = Object.create(Job.prototype);

ScreenShotJob.prototype.constructor = ScreenShotJob;

ScreenShotJob.prototype.exec = function (done) {
    var that = this;

    var format = config.screenshot.format || 'jpg';

    this.path = path.join(config.storePath, this.uniqueId, (config.screenshot.defaultName || 'screenshot') + '.' + format);

    screenshot(this.uri)
        .width(config.screenshot.width || 800)
        .height(config.screenshot.height || 600)
        .format(format)
        .capture(function(err, img) {
            
            if (err) {
                that.log(err.toString());
                return done();
            }

            mkdirp(path.dirname(that.path), function(err) {
                
                if (err) {
                    that.log(err.toString());
                    return done();
                }

                fs.writeFile(that.path, img, function(err) {

                    if (err) {
                        that.log(err.toString());
                        return done();
                    }

                    that.log('Screenshot of ' + that.uri + ' saved '+ that.path);

                    done();
                });
            });
        });
};

module.exports = ScreenShotJob;
