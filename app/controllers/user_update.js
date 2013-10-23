var redis = require('redis');
var config = require('../../config/config');

var client = redis.createClient(config.redis.port, config.redis.host, config.redis.options);

var prefix = config['socket.io'].userUpdateRedisKeyPrefix;

function userChannelName(userId) {
    return prefix + userId;
}

/**
 * Data wrapped to JSON.stringify and send to redis channel
 * @param userId
 * @param data
 */
var publishUserUpdate = function(userId, eventName, data) {
    client.publish(userChannelName(userId), JSON.stringify({ data: data, event: eventName }));
}

exports.publishUserUpdate = publishUserUpdate;

function capitalize(word) {
    return word.substring(0,1).toUpperCase() + word.substring(1);
}

function getId(model) {
    return model._id;
}

function identity(model) {
    return model;
}

var preprocessModelByChangeType = {
    'delete': getId
};

/*
This block will generate functions like:

createListboard or bulkCreateFolder
 */
['create', 'delete', 'update'].forEach(function(verb) {
    var processModel = preprocessModelByChangeType[verb];
    ['listboard', 'folder', 'item'].forEach(function(modelType) {
        exports[verb + capitalize(modelType)] = function(userId, model) {
            publishUserUpdate(
                userId,
                verb + '.' + modelType,
                processModel ? processModel(model): model);
        };

        exports['bulk' + capitalize(verb) + capitalize(modelType)] = function(userId, models) {
            publishUserUpdate(
                userId,
                'bulk.' + verb + '.' + modelType,
                processModel ? models.map(processModel): models);
        }
    })
});

// create separate for containers as it require to have listboard for work
['create', 'delete', 'update'].forEach(function(verb) {
    var processModel = preprocessModelByChangeType[verb];
    var modelType = 'container';
    // container require listboardId

    exports[verb + capitalize(modelType)] = function(userId, listboardId, model) {
        publishUserUpdate(
            userId,
            verb + '.' + modelType, {
                listboardId: listboardId,
                container: processModel ? processModel(model): model
            });
    };

    exports['bulk' + capitalize(verb) + capitalize(modelType)] = function(userId, listboardId, models) {
        publishUserUpdate(
            userId,
            'bulk.' + verb + '.' + modelType,{
                listboardId: listboardId,
                containers: processModel ? models.map(processModel): models
            });
    }

});

var waitUserUpdates = function(userId, callback) {
    var client = redis.createClient(config.redis.port, config.redis.host, config.redis.options);

    var channelName = userChannelName(userId);
    client.on('message', function(channel, message) {
        if(channel === channelName) {
            var parsedMessage = JSON.parse(message);

            callback(parsedMessage.event, parsedMessage.data);
        } else {
            //TODO log something
        }

    });

    client.subscribe(userChannelName(userId));

    return client;
};

exports.waitUserUpdates = waitUserUpdates;


