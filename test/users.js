var app = require("../"),
		_ = require('lodash'),
		expect = require('expect.js'),
		User = app.User;

//var mongoose = require('mongoose')
//  , db = mongoose.connect('mongodb://localhost/test');


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
		var user1 = new User({ password: 'password', email: 'a@a'});

		user1.save(function(err) {
			expect(err).to.be(undefined);
		});

		var user2 = new User({ email: 'a@a'});

		user2.save(function(err) {
			expect(Object.keys(err.errors).length).to.be(1);
		});
	});

	it('should require that user name, username is not empty alphanumberic sequence', function() {
		var user = new User({password: 'password', email: 'a@a', name: '', username: ''});

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

	it('should require that email contain @', function() {
		var user = new User({password: 'password', email: 'aa'});

		user.save(function(err) {
			expect(Object.keys(err.errors).length).to.be(1);
		});
	});


	it('should check that password match', function() {
		var user = new User({password: 'password'});

		user.save(function(err) {
			expect(user.authenticate('password')).to.be.ok();
			expect(user.authenticate('password1')).to.not.be.ok();
		});

		
	});
});
