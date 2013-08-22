/*var should = require('should'),
    request = require('supertest'),
    helper = require('../helper'),
    mongoose = require('mongoose');

var app = require('../../../app/server');

var testListboard = { label: "Dashboard" }

describe('listboard controller delete', function () {
    beforeEach(function (done) {
        helper.dropCollections(['users', 'lists'], done);
    });

    it('should return 200 with DELETE on /later/listboards/:listboardId when authenticated', function(done) {
        helper.authUser(app, done, function(cookie, userId) {
            var User = mongoose.model('User');

            User.byId(userId)
                .then(function(user) {
                    var listboard = user.laterListboard;

                    request(app)
                        .del('/later/listboards/'+listboard._id)
                        .set('Cookie', cookie)
                        .set('Accept', 'application/json')
                        .expect('Content-Type', /json/)
                        .expect(200)
                        .end(function(err, res) {
                            if(err) done(err);

                            res.body.should.have.property('_id');

                            done();
                        });
                }).fail(done);
        });
    });

    it('should return 401 with DELETE on /later/listboards/:listboardId when not authenticated', function(done) {

        request(app)
            .del('/later/listboards/SOMETHING')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(401, done);

    });

    it('should return 404 with DELETE on /later/listboards/:listboardId when  authenticated but listboard does not exists', function(done) {

        helper.authUser(app, done, function(cookie, userId) {

            request(app)
                .del('/later/listboards/SOMETHING')
                .set('Cookie', cookie)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(404, done);
        });

    })
});*/