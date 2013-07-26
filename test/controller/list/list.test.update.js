var should = require('should'),
    request = require('supertest'),
    helper = require('../helper'),
    mongoose = require('mongoose');

var app = require('../../../app/server');

var rootList = { label: "Development", path: "" }
var level1List = { label: "Database", path: "Development" }
var level2List = { label: "MongoDB", path: "Development/Database" }

describe('list controller update', function () {
    beforeEach(function (done) {
        helper.dropCollections(['users', 'lists'], done);
    });

    it('should update label and return 200 when authenticated and list found', function (done) {
        helper.authUser(app, done, function(cookie, userId) {

            helper.createList(app, rootList, done, cookie, function(list) {

                request(app)
                    .put('/lists/' + rootList._id)
                    .send( { label: "Programming" } )
                    .set('Cookie', cookie)
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end(function (err, res) {
                        if(err) done(err);

                        res.body.should.have.property('_id');

                        List.byId(res.body._id)
                        .then(function (l) {
                            l.label.should.be.equal("Programming");
                            done();
                        })
                        .fail(done);
                    });
            });
        });
    });

    it('should return 401 when updating list and not authenticated', function (done) {
        helper.authUser(app, done, function(cookie, userId) {

            helper.createList(app, rootList, done, cookie, function(list) {

                request(app)
                    .put('/lists/' + list._id)
                    .send( { label: "Programming" } )
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .expect(401, done);
            });
        });
    });

    it('should return 404 when updating a list that does not exist', function (done) {
        helper.authUser(app, done, function(cookie, userId) {
            
            request(app)
                .put('/lists/51f076574a698da47a000075')
                .send( { label: "Programming" } )
                .set('Cookie', cookie)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(404, done);
            });
    });

    it('should return 403 when updating list and not have not permission to do it', function (done) {
        helper.authUser(app, done, function(cookie, userId) {

            helper.createList(app, rootList, done, cookie, function(list) {

                helper.authUser2(app, done, function(cookie2, userId2) {

                    request(app)
                        .put('/lists/' + list._id)
                        .send( { label: "Programming" } )
                        .set('Cookie', cookie2)
                        .set('Accept', 'application/json')
                        .expect('Content-Type', /json/)
                        .expect(403, done);
                });
            });
        });
    });

});