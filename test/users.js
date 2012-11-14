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

	it('should not require set name, email, username, password if user came from ["twitter", "facebook", "google"]', function() {
		var user1 = new User({'provider': 'twitter'});

		user1.save(function(err) {
			expect(err).to.be.empty();
		});

		var user2 = new User({'provider': 'facebook'});

		user2.save(function(err) {
			expect(err).to.be.empty();
		});

		var user3 = new User({'provider': 'google'});

		user3.save(function(err) {
			expect(err).to.be.empty();
		});
		
	});

	it('should require set name, email, username, password if user came traditional way', function() {
		var user = new User();

		user.save(function(err) {
			expect(err).not.to.be(undefined);
			expect(err).to.be.an(Error);
		});

		
	});

	it('should require set not empty name, email, username, password if user came traditional way', function() {
		var user = new User({name: '', email: '', username: '', password: ''});

		user.save(function(err) {
			expect(err).not.to.be(undefined);
			expect(err).to.be.an(Error);
			expect(Object.keys(err.errors).length).to.be(3);
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
