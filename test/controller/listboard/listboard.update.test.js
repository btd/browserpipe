var should = require('should'),
    mongoose = require('mongoose');

var app = require('../../../app/server'), helper = require('../helper')(app);

describe('/listboard/:listboardId', function () {
    beforeEach(helper.cleanDB);

    describe('PUT', function () {
        it('should return 200', function (done) {
            helper.createUserAndlListboard(function (s) {
                var origListboard = s.user.listboards[0];
                origListboard.label = 'CHANGE';

                s.request
                    .put('/listboards/' + origListboard._id)
                    .send(origListboard.toJSON())
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) return done(err);

                        res.body.should.have.property('_id');

                        var User = mongoose.model('User');
                        User.byId(s.user._id)
                            .then(function (user) {
                                should.exist(user);

                                var listboard = user.listboards.id(res.body._id);
                                listboard.label.should.be.equal(origListboard.label);

                                done();
                            }, done)
                            .done();
                    });
            });
        });

        it('should return 401 when not authenticated', function (done) {
            helper.request()
                .put('/listboards/528621adeb4b67f347000008')
                .send({/* DOES NOT MATTER */})
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(401, done);
        });


        it('should return 400 when bad data', function (done) {
            helper.createUserAndlListboard(function (s) {
                var createdListboardId = s.user.listboards[0]._id;

                //just empty object
                s.request
                    .put('/listboards/' + createdListboardId)
                    .send({})
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .expect(400)
                    .end(function (err, res) {
                        if (err) done(err);

                        //empty string
                        s.request
                            .put('/listboards/' + createdListboardId)
                            .send({ label: '' })
                            .set('Accept', 'application/json')
                            .expect('Content-Type', /json/)
                            .expect(400)
                            .end(function (err, res) {
                                if (err) done(err);

                                //string with just space chars
                                s.request
                                    .put('/listboards/' + createdListboardId)
                                    .send({ label: '      ' })
                                    .set('Accept', 'application/json')
                                    .expect('Content-Type', /json/)
                                    .expect(400, done);
                            });
                    });

            });
        });
    });
});
