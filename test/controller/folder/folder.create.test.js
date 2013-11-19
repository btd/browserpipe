var should = require('should'),
    mongoose = require('mongoose');

var app = require('../../../app/server');
var helper = require('../helper')(app);


describe('/folders', function () {
    beforeEach(helper.cleanDB);

    it('by default user should have at least one root folder', function (done) {
        helper.createUser(function(s) {
            Folder.by({ user: s.user, path: '' }).then(function(folder) {
                if(!folder) return done(new Error('folder does not exists'));

                done();
            }, done)
            .done();
        });
    });

    describe('POST', function () {
        it('should create folder when parent folder exists', function (done) {
            helper.createUser(function(s) {
                Folder.by({ user: s.user, path: '' }).then(function(folder) {
                    s.request
                        .post('/folders')
                        .send(helper.subFolder(folder))
                        .set('Accept', 'application/json')
                        .expect('Content-Type', /json/)
                        .expect(200)
                        .end(function (err, res) {
                            if (err) done(err);

                            res.body.should.have.property('_id');
                            done();
                        });
                })
                .done();
            });
        });

        it('should return 401 when not authenticated', function (done) {
            helper.request()
                .post('/folders')
                .send({/* does not matter in this case */})
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(401, done);
        });

        it('should return 403 when creating a folder which parent does not exit', function (done) {
            helper.createUser(function(s) {
                s.request
                    .post('/folders')
                    .send(helper.subFolder({ fullPath: 'NOT_EXISTS' }))
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .expect(403, done);
            });
        });

        it('should return 403 when creating a folder with the same label data', function (done) {
            helper.createUser(function(s) {
                Folder.by({ user: s.user, path: '' }).then(function(folder) {
                    var subFolder = helper.subFolder(folder);

                    s.request
                        .post('/folders')
                        .send(subFolder)
                        .set('Accept', 'application/json')
                        .end(function () {
                            s.request
                                .post('/folders')
                                .send(subFolder)
                                .set('Accept', 'application/json')
                                .expect(403, done);
                        });
                })
                .done();
            });
        });

        it('should return 400 when bad data', function (done) {
            helper.createUser(function(s) {
                s.request
                    .post('/folders')
                    .send({ path: '', label: ''})
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .expect(400, done);
            });
        });
    });
});
