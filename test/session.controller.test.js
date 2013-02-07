
var request = require('supertest'),
    should = require('should');

var app = require('../app/server')

var User = require('../app/models/user')

var user = {email: 'a@a.com', password: 'password'}

describe('sessions controller', function(){

    before(function(done) {
        //User.remove({}, done);
        User.remove().exec();
        (new User(user)).save(done);
    });

	it('POST /sessions should return 200 if user info provided', function(done) {
        var sid = false;

		request(app)
		  .post('/sessions')
		  .send(user)
		  .expect(200, function(err, res) {
            if(err) done(err);

            sid = res.body.sid;
            sid.should.not.be.empty; //expect session id to be not empty

            done();
          });
	});

	it('POST /sessions should return 404 if user info provided wrong', function(done) {
		request(app)
		  .post('/sessions')
		  .send({email: 'b@b.com', password: 'asss'})
		  .expect(404, done);
	});
});
