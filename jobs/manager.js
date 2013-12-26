var kue = require('kue'),
    redis = require('redis'),
    rufus = require('rufus');

var config = require('../config');
var logger = rufus.getLogger('jobs');


kue.redis.createClient = function() {
    var client = redis.createClient(config.redis.port, config.redis.host, config.redis.options);
    return client;
};

var Jobs = function(options) {
    this.queue = kue.createQueue();
    this.options = options || {};

    this.options.attempts = this.options.attempts || 5;

    //Removed job upon completion
    this.queue.on('job complete', function(id){
        kue.Job.get(id, function(err, job){
            if (err) return;
            if(job)
                job.remove(function(err){
                    if (err) throw err;
                        logger.debug('removed completed job #%d', job.id);
                });
        });
    });
};

Jobs.prototype = {
    /**
     * Add job constuctor to know types of job that we can process
     * @param {String} name
     * @param {Function} jobType
     */
    add: function(name, jobType) {
        var that = this;

        this.queue.process(name, function(j, done) {            
            try {                
                (new jobType(j.data, j, that)).exec(done);
            } catch (err) {
                // handle the error safely
                logger.error('Error in job "%s"', name, err);
                done(err);
            }               
        });
    },

    /**
     * Schedule job execution
     * @param {String} name - the same used in Add
     * @param {Object} data
     */
    schedule: function(name, data) {
        logger.info('schedule job %s with %j', name, data);
        return this.queue.create(name, data)
            .attempts(this.options.attempts)
            .save();
    }
};

module.exports = Jobs;