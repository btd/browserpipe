var should = require('should'),
    mongoose = require('mongoose');

var app = require('../../app/server');

var testUser1 = { name: '', email: 'a@a.com', password: '123' };

var testUser2 = { email: 'a@a.com', password: '123' };

var userWithoutPassword = { email: 'a@a.com'};

var userWithEmptyPassword = { email: 'a@a.com', password: ''};

var userWithBadEmail = { email: 'a.com', password: '123'};

var User = mongoose.model('User');

var errorUserCreated = new Error('User was created');

describe('user model', function () {
    beforeEach(function () {
        mongoose.connection.db.dropCollection('users', function (err, result) {
            //i really dont worry about result i just need clean db
        });
    });

    it('should not allow save empty name', function (done) {
        var user = new User(testUser1);
        user.saveWithPromise()
            .then(function () {
                done(errorUserCreated);
            })
            .fail(function (err) {
                err.should.be.ok;
                done();
            });
    });

    it('should allow do not set name', function (done) {
        var user = new User(testUser2);
        user.save(function (err, res) {
            if (err) done(err);
            done();
        });
    });

    it('should not allow create users with the same email', function (done) {
        var user1 = new User(testUser2);
        user1.saveWithPromise().then(function () {
            var user2 = new User(testUser2);

            user2.saveWithPromise()
                .then(function () {
                    done(errorUserCreated);
                })
                .fail(function (err) {
                    err.should.be.ok;
                    done();
                });
        }, function (err) {
            done(err);
        });
    });

    it('should not allow create users with empty or missing password', function (done) {
        var user1 = new User(userWithoutPassword);
        user1.saveWithPromise().then(function () {
            done(errorUserCreated);
        }, function () {
            var user2 = new User(userWithEmptyPassword);
            user2.saveWithPromise().then(function () {
                done(errorUserCreated);
            }, function () {
                done();
            });
        });
    });

    it('should not allow create users with bad email', function (done) {
        var user1 = new User(userWithBadEmail);
        user1.saveWithPromise().then(function () {
            done(errorUserCreated);
        }, function () {
            done();
        });
    });
});
