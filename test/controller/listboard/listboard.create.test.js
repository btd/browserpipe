var should = require('should'),
    mongoose = require('mongoose');

var app = require('../../../app/server'),
    helper = require('../helper')(app);

describe('/listboards', function () {
    beforeEach(helper.cleanDB);

    describe('POST', function () {
        it('should return 200', function (done) {
            helper.createUser(function (s) {
                var dataListboard = helper.listboard();
                s.request
                    .post('/listboards')
                    .send(dataListboard)
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) done(err);

                        res.body.should.have.property('_id');
                        var User = mongoose.model('User');
                        User.byId(s.user._id).then(function (user) {
                            var listboard = user.listboards.id(res.body._id);
                            should(listboard).be.not.null;
                            listboard.label.should.be.equal(dataListboard.label);

                            done();
                        }, done)
                            .done();
                    });
            });
        });

        it('should return 401 when not authenticated', function (done) {
            helper.request()
                .post('/listboards')
                .send({ /* DOES NOT MATTER */})
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(401, done);
        });

        it('should return 400 when bad data', function (done) {
            helper.createUser(function (s) {
                //just empty object
                s.request
                    .post('/listboards')
                    .send({})
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .expect(400)
                    .end(function (err, res) {
                        if (err) done(err);

                        //empty string
                        s.request
                            .post('/listboards')
                            .send({ label: '' })
                            .set('Accept', 'application/json')
                            .expect('Content-Type', /json/)
                            .expect(400)
                            .end(function (err, res) {
                                if (err) done(err);

                                //string with just space chars
                                s.request
                                    .post('/listboards')
                                    .send({ label: '      ' })
                                    .set('Accept', 'application/json')
                                    .expect('Content-Type', /json/)
                                    .expect(400)
                                    .end(function (err, res) {
                                        if (err) done(err);

                                        done();
                                    });
                            });


                    });
            });


        })
    });
});