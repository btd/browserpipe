var should = require('should'),
    request = require('supertest'),
    helper = require('../helper'),
    mongoose = require('mongoose');

var app = require('../../../app/server');

var testListboard = { label: "Dashboard" };
var testListboard2 = { label: "Lisboard" };

describe('listboard controller update', function () {
    beforeEach(function (done) {
        helper.dropCollections(['users', 'lists'], done);
    });

    it('should return 200 and update listboard with POST on /listboards/:listboardId when authenticated and send good data', function (done) {
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

                    // listboard created
                    var createdListboardId = res.body._id;

                    request(app)
                        .put('/listboards/' + createdListboardId)
                        .send(testListboard2)
                        .set('Cookie', cookie)
                        .set('Accept', 'application/json')
                        .expect('Content-Type', /json/)
                        .expect(200)
                        .end(function (err, res) {
                            if(err) done(err);

                            res.body.should.have.property('_id');
                            createdListboardId.should.be.equal(res.body._id);

                            var User = mongoose.model('User');

                            User.byId(userId)
                                .then(function(user) {
                                    should.exist(user);

                                    var listboard = user.listboards.id(createdListboardId);

                                    listboard.label.should.be.equal(testListboard2.label);

                                    done();
                                }).fail(done);

                        });


                });
        });
    });

    it('should return 401 with PUT on /listboards/:listboardId when not authenticated', function (done) {

        request(app)
            .put('/listboards/SOME+ID')
            .send(testListboard)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(401, done);

    });

    it('should return 400 with PUT on /listboards/:listboardId when authenticated but bad data', function (done) {

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

                    // listboard created
                    var createdListboardId = res.body._id;

                    //just empty object
                    request(app)
                        .put('/listboards/' + createdListboardId)
                        .send({})
                        .set('Cookie', cookie)
                        .set('Accept', 'application/json')
                        .expect('Content-Type', /json/)
                        .expect(400)
                        .end(function (err, res) {
                            if(err) done(err);

                            //empty string
                            request(app)
                                .put('/listboards/' + createdListboardId)
                                .send({ label: '' })
                                .set('Cookie', cookie)
                                .set('Accept', 'application/json')
                                .expect('Content-Type', /json/)
                                .expect(400)
                                .end(function (err, res) {
                                    if(err) done(err);

                                    //string with just space chars
                                    request(app)
                                        .put('/listboards/' + createdListboardId)
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
});