var rufus = require('rufus');

var Job = function(options, instance, jobs) {
    this.options = options;
    this.jobs = jobs;
    this._instance = instance;
    this.logger = rufus.getLogger('job.' + this.name + '.' + instance.id);
};

Job.prototype = {
    log: function() {
        this._instance.log.apply(this._instance, arguments);
        this.logger.info.apply(this.logger, arguments);
    },
    run: function(done) {
        var start = new Date().getTime();
        this.log('start job %s with data %O', this.name, this.options);
        var that = this;
        this.exec(function() {
            that.log('finish job %s within %d ms', that.name, (new Date().getTime() - start));
            done.apply(null, arguments);
        });
    },
    constructor: Job
};


module.exports = Job;