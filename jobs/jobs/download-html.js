var DonwloadJob = require('./download');

//TODO need test timeouts and redirects
//TODO need way to specify headers, maybe from extension
var DownloadHtmlJob = function (options, instance, jobs) {
    DonwloadJob.call(this, options, instance, jobs);
};

DownloadHtmlJob.prototype = Object.create(DonwloadJob.prototype);

DownloadHtmlJob.prototype.name = 'download-html';

DownloadHtmlJob.prototype.constructor = DownloadHtmlJob;

DownloadHtmlJob.prototype.exec = function (done) {
    var that = this;
    DonwloadJob.prototype.exec.call(this, function () {
        that.log('Html content - schedule processing');
        that.jobs.schedule('process-html', { uri: that.uri, path: that.path, uniqueId: that.uniqueId })
            .on('complete', function () {
                done();
            });
    });
};

module.exports = DownloadHtmlJob;