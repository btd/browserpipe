var should = require('should'),
    mongoose = require('mongoose');

var app = require('../../../app/server'),
    helper = require('../helper')(app);

describe('/folders/:folderId', function () {
    beforeEach(helper.cleanDB);

    describe('PUT', function() {
        it('should return 200 when authenticated and folder found', function (done) {
            helper.createUser(function(s) {
                var Folder = mongoose.model('Folder');
                
                Folder.by({ user: s.user, path: '' }).then(function(folder) {
                    var subFolder = helper.subFolder(folder);
                    s.request
                        .post('/folders')
                        .send(subFolder)
                        .set('Accept', 'application/json')
                        .end(function (err, res) {
                            subFolder._id = res.body._id;

                            subFolder.label = 'CHANGE';

                            s.request
                                .put('/folders/' + subFolder._id)
                                .send(subFolder)
                                .set('Accept', 'application/json')
                                .expect('Content-Type', /json/)
                                .expect(200)
                                .end(function (err, res) {
                                    if (err) return done(err);

                                    Folder.byId(subFolder._id)
                                        .then(function (l) {
                                            if(!l) return done(new Error('Folder does not exists'));
                                            l.label = subFolder.label;
                                            done();
                                        }, done);
                                });
                        });
                })
                .done();
            });
        });

        it('should return 401 when updating folder and not authenticated', function (done) {
            helper.request()
                .put('/folders/528621adeb4b67f347000008')
                .send({/* DOES NOT MATTER */})
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(401, done);
        });

        it('should return 404 when updating a folder that does not exist', function (done) {
            helper.createUser(function(s) {
                s.request
                    .put('/folders/51f076574a698da47a000075')
                    .send({/* DOES NOT MATTER */})
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .expect(404, done);
            });
        });
    });
});