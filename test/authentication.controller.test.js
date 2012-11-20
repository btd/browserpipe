
var request = require('supertest');

var express = require('express')
  	, passport = require('passport')
  	, app = express();

describe('authentication controller', function(){

	before(function(done){
		app.set('views', __dirname + '/../app/views');
  	app.set('view engine', 'jade');
  	app.set('view options', {'layout': false});
  	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));

		require('../app/controllers/authentication')(app, passport);
    
    done();
  })

	it('GET /login should return 200', function(done) {
		request(app)
		  .get('/login')
		  .expect('Content-Type', /html/)
		  .expect(200, done);
	});
});
