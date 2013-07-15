var should = require('should'),
    request = require('supertest'),
    helper = require('./helper'),
    mongoose = require('mongoose');

var app = require('../../app/server');

var testListboard = { label: "Dashboard" }

describe('listboard controller', function () {
    beforeEach(function (done) {
        helper.dropCollections(['users', 'listboards', 'lists'], done);
    });

    it('should create listboard with POST on /listboards when authenticated and send good data', function (done) {
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

                    var Listboard = mongoose.model('Listboard');

                    Listboard.byId(res.body._id, '_id label user')
                        .then(function(listboard) {
                            should.exist(listboard);

                            listboard.label.should.be.equal(testListboard.label);
                            listboard.user._id.toString().should.be.equal(userId);

                            done();
                        }).fail(done);
                });
        });
    });
});