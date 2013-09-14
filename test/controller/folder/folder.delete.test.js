var should = require('should'),
    request = require('supertest'),
    helper = require('../helper'),
    mongoose = require('mongoose'),
    q = require('q');

var app = require('../../../app/server');

var rootFolder = { label: "Development", path: "" }
var level1Folder = { label: "Database", path: "Development" }
var level2Folder = { label: "MongoDB", path: "Development/Database" }

describe('folder controller delete', function () {
    beforeEach(function (done) {
        helper.dropCollections(['users', 'folders'], done);
    });

    it('should delete folder and return 200 when authenticated and folder found', function (done) {
        helper.authUser(app, done, function(cookie, userId) {

            helper.createFolder(app, rootFolder, done, cookie, function(folder) {

                request(app)
                    .del('/folders/' + folder._id)
                    .set('Cookie', cookie)
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end(function (err, res) {
                        if(err) done(err);
                        else {
                            Folder.byId(folder._id)
                            .then(function (l) { 
                                if(l) done(new Error('Folder was not deleted'));
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

    it('should delete folder, child folders and return 200 when authenticated and folder found', function (done) {
        helper.authUser(app, done, function(cookie, userId) {

            helper.createFolder(app, rootFolder, done, cookie, function(folder) {

                helper.createFolder(app, level1Folder, done, cookie, function(folder1) {

                    helper.createFolder(app, level2Folder, done, cookie, function(folder2) {
                        
                        request(app)
                            .del('/folders/' + folder._id)
                            .set('Cookie', cookie)
                            .set('Accept', 'application/json')
                            .expect('Content-Type', /json/)
                            .expect(200)
                            .end(function (err, res) {
                                if(err) done(err);
                                else {
                                    q.all([
                                        Folder.byId(folder._id),
                                        Folder.byId(folder1._id),
                                        Folder.byId(folder2._id),
                                    ])
                                    .spread(function (l, l1, l2) { 
                                        if(l || l1 || l2) done(new Error('Folders were not deleted'));
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

    it('should return 401 with DELETE on /folder/:folderId when not authenticated', function(done) {
        helper.authUser(app, done, function(cookie, userId) {

            helper.createFolder(app, rootFolder, done, cookie, function(folder) {

                request(app)
                    .del('/folders/' + folder._id)
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .expect(401, done);
            });
        });

    });

    it('should return 404 with DELETE on /folder/:folderId when  authenticated but folder does not exists', function(done) {
        helper.authUser(app, done, function(cookie, userId) {

            request(app)
                .del('/folders/51f076574a698da47a000075')
                .set('Cookie', cookie)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(404, done);
        });

    });


    //TODO: Should we verify here that when a folder is deleted, containers with that filter
    //and folders are remove from items folders field. Or should we test that on an integrated test.

});