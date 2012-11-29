
var request = require('supertest')

var app = require('../app/server')

var User = require('../app/models/user')

var user = {email: 'a@a.com', password: 'password'}

describe('sessions controller', function(){

	beforeEach(function(done) {
		User.remove({email: user.email}, function(err) {
			(new User(user)).save(done);
		});
	});

	it('POST /sessions should return 200 if user info provided', function(done) {
		request(app)
		  .post('/sessions')
		  .send(user)
		  .expect(200, done);
	});

	it('POST /sessions should return 404 if user info provided wrong', function(done) {
		request(app)
		  .post('/sessions')
		  .send({email: 'b@b.com', password: 'asss'})
		  .expect(404, done);
	});
});
