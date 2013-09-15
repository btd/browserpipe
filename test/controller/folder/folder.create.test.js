var should = require('should'),
    request = require('supertest'),
    helper = require('../helper'),
    mongoose = require('mongoose');

var app = require('../../../app/server');

var rootFolder = { label: "Development", path: "" }
var level1Folder = { label: "Database", path: "Development" }
var level2Folder = { label: "MongoDB", path: "Development/Database" }

describe('folder controller create', function () {
    beforeEach(function (done) {
        helper.dropCollections(['users', 'folders'], done);
    });

    it('should return 200 and create a root folder with POST on /folders when authenticated and send good data', function (done) {
        helper.authUser(app, done, function(cookie, userId) {

            request(app)
                .post('/folders')
                .send(rootFolder)
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

    it('should return 200 and create folder of level1 if the parent exits with POST on /folders when authenticated and send good data', function (done) {
        helper.authUser(app, done, function(cookie, userId) {

            helper.createFolder(app, rootFolder, done, cookie, function() {

                request(app)
                    .post('/folders')
                    .send(level1Folder)
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

    it('should return 200 and create folder of level2 if the parent exits with POST on /folders when authenticated and send good data', function (done) {
        helper.authUser(app, done, function(cookie, userId) {

            helper.createFolder(app, rootFolder, done, cookie, function() {

                helper.createFolder(app, level1Folder, done, cookie, function() {

                    request(app)
                        .post('/folders')
                        .send(level2Folder)
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

    it('should return 401 with POST on /folders when not authenticated', function (done) {

        request(app)
            .post('/folders')
            .send(rootFolder)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(401, done);

    });

    it('should return 400 when creating a folder which parent does not exit', function (done) {
        helper.authUser(app, done, function(cookie, userId) {

            request(app)
                .post('/folders')
                .send(level1Folder)
                .set('Cookie', cookie)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400, done);
        });
    });

});