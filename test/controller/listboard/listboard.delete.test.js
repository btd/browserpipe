var should = require('should'),
    request = require('supertest'),
    helper = require('../helper'),
    mongoose = require('mongoose');

var app = require('../../../app/server');

describe('listboard controller delete', function () {
    beforeEach(function (done) {
        helper.dropCollections(['users', 'folders'], done);
    });

    it('should return 200 with DELETE on /listboards/:listboardId when authenticated', function(done) {
        helper.authUser(app, done, function(cookie, userId) {
            var User = mongoose.model('User');

            User.byId(userId)
                .then(function(user) {
                    var listboard = user.listboards[0];

                    request(app)
                        .del('/listboards/'+listboard._id)
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

    it('should return 401 with DELETE on /listboards/:listboardId when not authenticated', function(done) {

        request(app)
            .del('/listboards/SOMETHING')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(401, done);

    });

    it('should return 404 with DELETE on /listboards/:listboardId when  authenticated but listboard does not exists', function(done) {

        helper.authUser(app, done, function(cookie, userId) {

            request(app)
                .del('/listboards/SOMETHING')
                .set('Cookie', cookie)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(404, done);
        });

    })
});