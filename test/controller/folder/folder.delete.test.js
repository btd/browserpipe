var should = require('should'),
    mongoose = require('mongoose'),
    q = require('q');

var app = require('../../../app/server');
    helper = require('../helper')(app);

describe('/folders/:folderId', function () {
    beforeEach(helper.cleanDB);

    describe('DELETE', function () {

        it('should return 200 when folder exists', function(done) {
            helper.createUser(function(s) {
                var Folder = mongoose.model('Folder');

                Folder.by({ user: s.user, path: '' }).then(function(folder) {
                    s.request
                        .post('/folders')
                        .send(helper.subFolder(folder))
                        .set('Accept', 'application/json')
                        .end(function (err, res) {
                            var createSubFolder = res.body;

                            s.request
                                .del('/folders/' + createSubFolder._id)
                                .set('Accept', 'application/json')
                                .expect('Content-Type', /json/)
                                .expect(200)
                                .end(function (err, res) {
                                    if (err) return done(err);

                                    Folder.byId(createSubFolder._id)
                                        .then(function (l) {
                                            if (l) done(new Error('Folder was not deleted'));
                                            else done();
                                        }, done);
                                });
                        });
                })
                .done();
            });
        });

        it('should return 401 when not authenticated', function (done) {
            helper.request()
                .del('/folders/528621adeb4b67f347000008')//just semi random id
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(401, done);
        });

        it('should return 404 when authenticated but folder does not exists', function (done) {
            helper.createUser(function(s) {
                s.request
                    .del('/folders/528621adeb4b67f347000008')
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .expect(404, done);
            });
        });

        it('should return 200 and delete all subfolders', function(done) {
            helper.createUser(function(s) {
                var Folder = mongoose.model('Folder');

                Folder.by({ user: s.user, path: '' }).then(function(folder) {
                    s.request
                        .post('/folders')
                        .send(helper.subFolder(folder))
                        .set('Accept', 'application/json')
                        .end(function (err, res) {
                            var subFolder1 = res.body;

                            s.request
                                .post('/folders')
                                .send(helper.subFolder(subFolder1))
                                .set('Accept', 'application/json')
                                .end(function (err, res) {
                                    var subFolder2 = res.body;

                                    s.request
                                        .del('/folders/' + folder._id)
                                        .set('Accept', 'application/json')
                                        .expect('Content-Type', /json/)
                                        .expect(200)
                                        .end(function (err, res) {
                                            if (err) return done(err);

                                            q([
                                                Folder.byId(folder._id),
                                                Folder.byId(subFolder1._id),
                                                Folder.byId(subFolder2._id)
                                            ])
                                            .spread(function (l, l1, l2) {
                                                if (l || l1 || l2) done(new Error('Folders were not deleted'));
                                                else done();
                                            }, done);
                                        });
                                });
                        });
                })
                .done();
            });
        })
    });

});