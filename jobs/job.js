var Job = function(options, instance, jobs) {
    this.jobs = jobs;
    this._instance = instance;
};

Job.prototype = {
    log: function() {
        this._instance.log.apply(this._instance, arguments);
        console.log.apply(console, arguments);
    },
    constructor: Job
};


module.exports = Job;