var kue = require('kue'),
    redis = require('redis');

var config = require('./config');

kue.redis.createClient = function() {
    var client = redis.createClient(config.redis.port, config.redis.host);
    return client;
};

var Jobs = function(options) {
    this.queue = kue.createQueue();

    //Removed job upon completion
    this.queue.on('job complete', function(id){
      kue.Job.get(id, function(err, job){
        if (err) return;
        job.remove(function(err){
          if (err) throw err;
          console.log('removed completed job #%d', job.id);
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
                console.log('Error in job "' + name + '": ' + err);
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
        return this.queue.create(name, data)
            .attempts(5)
            .save();
    }
};

module.exports = Jobs;