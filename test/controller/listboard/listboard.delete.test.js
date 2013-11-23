var should = require('should'),
    mongoose = require('mongoose');

var app = require('../../../app/server'),
    helper = require('../helper')(app);

describe('/listboards/:listboardId', function () {
    beforeEach(helper.cleanDB);

    describe('DELETE', function() {
        it('should return 200', function(done) {
            helper.createUser(function(s) {
                var listboard = s.user.listboards[0];

                s.request
                    .del('/listboards/'+listboard._id)
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end(function(err, res) {
                        if(err) done(err);

                        res.body.should.have.property('_id');
                        done();
                    });
            });
        });

        it('should return 401 when not authenticated', function(done) {
            helper.request()
                .del('/listboards/528621adeb4b67f347000008')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(401, done);
        });

        it('should return 404 when listboard does not exists', function(done) {
            helper.createUser(function(s) {
                s.request
                    .del('/listboards/528621adeb4b67f347000008')
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .expect(404, done);
            });

        });
    });
});