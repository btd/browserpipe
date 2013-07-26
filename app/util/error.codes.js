var errorCodes = {	
	BadRequest: [400, { error: 'Bad Request' }],
	InternalServer: [500, { error: 'Internal Server Error' }],
	NotFound: [404, { error: 'Not Found' }],
	Unauthorized: [401, { error: 'Unauthorized' }],
	Forbidden: [403, { error: 'Forbidden' }]
}

module.exports = errorCodes;



