var should = require('should'),
    mongoose = require('mongoose');

var app = require('../../app/server');

var testUser = { name: 'Test', email: 'a@a.com', password: '123' };

describe('user model', function () {
    before(function () {
        mongoose.connection.db.dropCollection('users', function (err, result) {
            //i really dont worry about result i just need clean db
        });
    });

    it('should allow create users', function (done) {
        done();
    });
});
