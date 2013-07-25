var should = require('should'),
    request = require('supertest'),
    helper = require('../helper'),
    mongoose = require('mongoose');

var app = require('../../../app/server');

var rootList = { label: "Development", path: "" }
var level1List = { label: "Database", path: "Development" }
var level2List = { label: "MongoDB", path: "Development/Database" }

describe('list controller create', function () {
    beforeEach(function (done) {
        helper.dropCollections(['users', 'lists'], done);
    });

    it('should return 200 and create a root list with POST on /lists when authenticated and send good data', function (done) {
        helper.authUser(app, done, function(cookie, userId) {

            request(app)
                .post('/lists')
                .send(rootList)
                .set('Cookie', cookie)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function (err, res) {
                    if(err) done(err);

                    res.body.should.have.property('_id');

                    done();
                });
        });
    });

    it('should return 200 and create list of level1 if the parent exits with POST on /lists when authenticated and send good data', function (done) {
        helper.authUser(app, done, function(cookie, userId) {

            helper.createList(app, rootList, done, cookie, function() {

                request(app)
                    .post('/lists')
                    .send(level1List)
                    .set('Cookie', cookie)
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end(function (err, res) {
                        if(err) done(err);

                        res.body.should.have.property('_id');

                        done();
                    });
            });
        });
    });

    it('should return 200 and create list of level2 if the parent exits with POST on /lists when authenticated and send good data', function (done) {
        helper.authUser(app, done, function(cookie, userId) {

            helper.createList(app, rootList, done, cookie, function() {

                helper.createList(app, level1List, done, cookie, function() {

                    request(app)
                        .post('/lists')
                        .send(level2List)
                        .set('Cookie', cookie)
                        .set('Accept', 'application/json')
                        .expect('Content-Type', /json/)
                        .expect(200)
                        .end(function (err, res) {
                            if(err) done(err);

                            res.body.should.have.property('_id');

                            done();
                        });
                });
            });
        });
    });

    it('should return 401 with POST on /lists when not authenticated', function (done) {

            request(app)
                .post('/lists')
                .send(rootList)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(401, done);

    });

    it('should return 400 when creating a list which parent does not exit', function (done) {
        helper.authUser(app, done, function(cookie, userId) {

            request(app)
                .post('/lists')
                .send(level1List)
                .set('Cookie', cookie)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400, done);
        });
    });

});