var should = require('should'),
    request = require('supertest'),
    helper = require('../helper'),
    mongoose = require('mongoose'),
    q = require('q');

var app = require('../../../app/server');

var rootList = { label: "Development", path: "" }
var level1List = { label: "Database", path: "Development" }
var level2List = { label: "MongoDB", path: "Development/Database" }

describe('list controller delete', function () {
    beforeEach(function (done) {
        helper.dropCollections(['users', 'lists'], done);
    });

    it('should delete list and return 200 when authenticated and list found', function (done) {
        helper.authUser(app, done, function(cookie, userId) {

            helper.createList(app, rootList, done, cookie, function(list) {

                request(app)
                    .del('/lists/' + list._id)
                    .set('Cookie', cookie)
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end(function (err, res) {
                        if(err) done(err);
                        else {
                            List.byId(list._id)
                            .then(function (l) { 
                                if(l) done(new Error('List was not deleted'));
                                else done();
                            })
                            .fail(function (err) {
                                err.should.be.ok;
                                done();
                            });
                        }
                    });
            });
        });
    });

    it('should delete list, child lists and return 200 when authenticated and list found', function (done) {
        helper.authUser(app, done, function(cookie, userId) {

            helper.createList(app, rootList, done, cookie, function(list) {

                helper.createList(app, level1List, done, cookie, function(list1) {

                    helper.createList(app, level2List, done, cookie, function(list2) {
                        
                        request(app)
                            .del('/lists/' + list._id)
                            .set('Cookie', cookie)
                            .set('Accept', 'application/json')
                            .expect('Content-Type', /json/)
                            .expect(200)
                            .end(function (err, res) {
                                if(err) done(err);
                                else {
                                    q.all([
                                        List.byId(list._id),
                                        List.byId(list1._id),
                                        List.byId(list2._id),
                                    ])
                                    .spread(function (l, l1, l2) { 
                                        if(l || l1 || l2) done(new Error('Lists were not deleted'));
                                        else done();
                                    })
                                    .fail(function (err) {
                                        err.should.be.ok;
                                        done();
                                    });
                                }
                            });
                    });
                });
            });
        });
    });

    it('should return 401 with DELETE on /list/:listId when not authenticated', function(done) {
        helper.authUser(app, done, function(cookie, userId) {

            helper.createList(app, rootList, done, cookie, function(list) {

                request(app)
                    .del('/lists/' + list._id)
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .expect(401, done);
            });
        });

    });

    it('should return 404 with DELETE on /list/:listId when  authenticated but list does not exists', function(done) {
        helper.authUser(app, done, function(cookie, userId) {

            request(app)
                .del('/lists/51f076574a698da47a000075')
                .set('Cookie', cookie)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(404, done);
        });

    });


    //TODO: Should we verify here that when a list is deleted, containers with that filter
    //and lists are remove from items lists field. Or should we test that on an integrated test.

});