var logger = require('rufus').getLogger('app.errors');

var errorCodes = {
	BadRequest: [400, { error: 'Bad Request' }],
	InternalServer: [500, { error: 'Internal Server Error' }],
	NotFound: [404, { error: 'Not Found' }],
	Unauthorized: [401, { error: 'Unauthorized' }],
	Forbidden: [403, { error: 'Forbidden' }]
}
// export errors
Object.keys(errorCodes).forEach(function(errorName) {
    module.exports[errorName] = errorCodes[errorName];
});

// helper functions to just send coresponding error
Object.keys(errorCodes).forEach(function(errorName) {
    module.exports['send' + errorName] = function(res) {
        res.send.apply(res, errorCodes[errorName]);
    }
});

// helper functions for promises
Object.keys(errorCodes).forEach(function(errorName) {
    module.exports['ifErrorSend' + errorName] = function(res) {
        return function(err) {
            logger.error('Error happen', err);
            module.exports['send' + errorName](res);
        }

    }
});





