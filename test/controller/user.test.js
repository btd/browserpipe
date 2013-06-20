var should = require('should'),
    request = require('supertest'),
    mongoose = require('mongoose');

var app = require('../../app/server');

var testUser = { name: 'Test', email: 'a@a.com', password: '123' };

describe('user controller', function () {
    before(function () {
        mongoose.connection.db.dropCollection('users', function (err, result) {
            //i really dont worry about result i just need clean db
        });
    });

    it('should be created with POST on /users when send good data', function (done) {
        request(app)
            .post('/users')
            .send(testUser)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                if (err) done(err);
                else {
                    res.body.should.not.have.property('errors');
                    //console.log(res.body);
                    res.body.should.have.property('_id');

                    var userId = res.body._id;
                    var User = mongoose.model('User');

                    User.byId(userId, function (err, user) {
                        if (err) done(err)
                        else {
                            user.name.should.be.equal(testUser.name);
                            user.email.should.be.equal(testUser.email);
                            user.authenticate(testUser.password).should.be.true;
                            done();
                        }
                    });
                }
            });
    });
});