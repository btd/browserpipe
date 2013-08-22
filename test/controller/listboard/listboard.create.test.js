var should = require('should'),
    request = require('supertest'),
    helper = require('../helper'),
    mongoose = require('mongoose');

var app = require('../../../app/server');

var testListboard = { label: "Dashboard" }

describe('listboard controller create', function () {
    beforeEach(function (done) {
        helper.dropCollections(['users', 'lists'], done);
    });

    it('should return 200 and create listboard with POST on /listboards when authenticated and send good data', function (done) {
        helper.authUser(app, done, function(cookie, userId) {

            request(app)
                .post('/listboards')
                .send(testListboard)
                .set('Cookie', cookie)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function (err, res) {
                    if(err) done(err);

                    res.body.should.have.property('_id');

                    var User = mongoose.model('User');

                    User.byId(userId)
                        .then(function(user) {
                            should.exist(user);

                            var listboard = user.currentListboard;

                            listboard.label.should.be.equal(testListboard.label);
                            listboard._id.toString().should.be.equal(res.body._id);

                            done();
                        }).fail(done);
                });
        });
    });

    it('should return 401 with POST on /listboards when not authenticated', function (done) {

            request(app)
                .post('/listboards')
                .send(testListboard)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(401, done);

    });

    it('should return 400 with POST on /listboards when authenticated but bad data', function (done) {

        helper.authUser(app, done, function(cookie, userId) {

            //just empty object
            request(app)
                .post('/listboards')
                .send({})
                .set('Cookie', cookie)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400)
                .end(function (err, res) {
                    if(err) done(err);

                    //empty string
                    request(app)
                        .post('/listboards')
                        .send({ label: '' })
                        .set('Cookie', cookie)
                        .set('Accept', 'application/json')
                        .expect('Content-Type', /json/)
                        .expect(400)
                        .end(function (err, res) {
                            if(err) done(err);

                            //string with just space chars
                            request(app)
                                .post('/listboards')
                                .send({ label: '      ' })
                                .set('Cookie', cookie)
                                .set('Accept', 'application/json')
                                .expect('Content-Type', /json/)
                                .expect(400)
                                .end(function (err, res) {
                                    if(err) done(err);

                                    done();
                                });
                        });


                });
        });

    });
});