var coverage = require('./coverage'),
		expect = require('expect.js'),
		User = coverage.require('../app/models/user');

describe('user model', function() {
	it('should not allow set empty password', function() {
		var user = new User();

		user.set('password', '');
		expect(user.get('password')).to.not.be.ok();

		user.set('password', null);
		expect(user.get('password')).to.not.be.ok();

		user.set('password', undefined);
		expect(user.get('password')).to.not.be.ok();
	});

	it('should allow set not empty password', function() {
		var user = new User();

		user.set('password', 'password');
		expect(user.get('password')).not.to.be.empty();
	});

	it('should require set only password and email', function() {
		var user1 = new User({ password: 'password', email: 'a@a.com'});

		user1.save(function(err) {
			expect(err).to.be(undefined);
		});

		var user2 = new User({ email: 'a@a.com'});

		user2.save(function(err) {
			expect(Object.keys(err.errors).length).to.be(1);
		});
	});

	it('should require that user name, username is not empty alphanumberic sequence', function() {
		var user = new User({password: 'password', email: 'a@a.com', name: '', username: ''});

		user.save(function(err) {
			expect(Object.keys(err.errors).length).to.be(2);
			expect(err.errors.name.type).to.be('nonEmpty');
			expect(err.errors.username.type).to.be('nonEmpty');
		});

		user.name = 'normal name';
		user.username = 'username'

		user.save(function(err) {
			expect(err).to.not.be.ok();
		});
	});

	it('should require that email contain @', function(done) {
		var user = new User({password: 'password', email: 'aa'});

		user.save(function(err) {
			expect(Object.keys(err.errors).length).to.be(1);
			done();
		});
	});


	it('should check that password match', function(done) {
		var user = new User({password: 'password'});

		user.verifyPassword('password', function(err, passwordCorrect) {
			expect(passwordCorrect).to.be.ok();
			done();
		});

		
	});

	it('should check that password could not match', function(done) {
		var user = new User({password: 'password1'});

		user.verifyPassword('password', function(err, passwordCorrect) {
			expect(passwordCorrect).to.not.be.ok();
			done();
		});

		
	});
});
