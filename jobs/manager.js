var kue = require('kue'),
    redis = require('redis');

var config = require('./config');

kue.redis.createClient = function() {
    var client = redis.createClient(config.redis.port, config.redis.host);
    return client;
};

var Jobs = function(options) {
    this.queue = kue.createQueue();
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
            (new jobType(j.data, j, that)).exec(done);
        });
    },

    /**
     * Schedule job execution
     * @param {String} name - the same used in Add
     * @param {Object} data
     */
    schedule: function(name, data) {
        this.queue.create(name, data)
            .attempts(5)
            .save();
    }
};

module.exports = Jobs;