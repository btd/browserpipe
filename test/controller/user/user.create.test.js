var should = require('should'),
    request = require('supertest'),
    mongoose = require('mongoose');

var app = require('../../../app/server');

var helper = require('../helper')(app);

describe('/users', function () {
    describe('POST', function () {

        it('should create user', function (done) {
            var testUser = helper.user();

            request(app)
                .post('/users')
                .send(testUser)
                .type('form')
                .expect(302)
                .end(function (err, res) {
                    if (err) return done(err);
                    res.headers.location.should.be.equal('/listboards');

                    var User = mongoose.model('User');
                    User.byEmail(testUser.email)
                        .then(function (user) {
                            if (!user) done(new Error('User does not exists'));

                            user.should.include({
                                name: testUser.name,
                                email: testUser.email.toLowerCase()
                            });

                            user.authenticate(testUser.password, function(err, res) {
                                if(err) return done(err);

                                res.should.be.true;
                                done();
                            });
                        }, done)
                        .done();
                });
        })
    })
});
