var Cookie = require('cookiejar').Cookie,
    request = require('supertest').agent,
    mongoose = require('mongoose');

var Faker = require('Faker');

function dropOneCollection(collectionName, done) {
    mongoose.connection.collection(collectionName).drop(function (err, result) {
        //if(err) return done(err);
        done();
    });
}

function dropManyCollections(collections, done) {
    if (collections.length > 0) {
        dropOneCollection(collections.shift(), function (err) {
            if(err) return done(err);

            dropManyCollections(collections, done);
        });
    } else {
        done();
    }
}

var collections = ['users', 'items', 'folders', 'listboards'];

function cleanDB(done) {
    dropManyCollections(collections, done);
}

function rethrow(err) {
    throw err;
}

module.exports = function(app) {
    var req = function() {
        return request(app);
    }

    function UserSession(data) {
        this.user = data.user;
        this.cookie = data.cookie;
    }

    UserSession.prototype = {};

    Object.defineProperty(UserSession.prototype, 'request', {
        get: function() {
            var r = req();
            r.jar.setCookies(this.cookie);

            return r;
        }
    });

    return {
        app: app,

        dropCollections: dropManyCollections,
        cleanDB: cleanDB,

        request: req,

        user: function() {
            return {
                name: Faker.Name.findName(),
                email: Faker.Internet.email(),
                password: String(Faker.random.number(10000))
            }
        },

        createUser: function(data, callback) {
            if(typeof data === 'function') {
                callback = data;
                data = this.user();
            }

            this.request()
                .post('/users')
                .send(data)
                .type('form')
                .end(function(err, res) {
                    if(err) throw err;

                    var User = mongoose.model('User');
                    User.byEmail(data.email).then(function (user) {
                        callback(new UserSession({ cookie: res.get("set-cookie"), user: user }))
                    }, rethrow);
                })
        },

        createUserAndlListboard: function(data) {
            var self = this;            
            this.createUser(function(s) {
                s.user.addListboard(helper.listboard());
                s.user.saveWithPromise()
                    .then(function(){ data(s)})
                    .fail(rethrow)
            })
        },        

        subFolder: function(parentFolder) {
            return {
                label: Faker.random.catch_phrase_noun(),
                path: parentFolder.fullPath || (parentFolder.path === '' ? parentFolder.label : (parentFolder.path + '/' + parentFolder.label))
            }
        },

        listboard: function() {
            return {
                type: 1,
                label: Faker.random.catch_phrase_noun()
            }
        }
    }
}
/*
module.exports.authUser = function (app, done, callback) {
    authUserInternal(app, done, callback, user)
};

module.exports.authUser2 = function (app, done, callback) {
    authUserInternal(app, done, callback, user2)
};

function authUserInternal(app, done, callback, user) {
    request(app)
        .post('/users')
        .send(user)
        .end(function (err, res) {
            res.redirect.should.be.true;

            var cookie = new Cookie(res.get("set-cookie")[0]);
            var cookieValue = cookie.toValueString();

            request(app)
                .post('/users/session')
                .type('form')
                .send(user)
                .set('Cookie', cookieValue)
                .end(function (err, res) {
                    if (err) done(err);

                    res.redirect.should.be.true;

                    User.byEmail(user.email).then(function (user) {
                        callback(cookieValue, user);
                    }, done);
                });
        });
}

module.exports.createFolder = function (app, f, done, callback) {
    withParentFolder(app, done, function(folder, cookie, user) {
        module.exports.createSubFolder(app, f, folder, cookie, done, callback);
    });
};

module.exports.createSubFolder = function(app, f, parentFolder, cookie, done, callback) {
    f.path = f.path === '' ? parentFolder.fullPath : (parentFolder.fullPath + '/' + f.path);
    request(app)
        .post('/folders')
        .send(f)
        .set('Cookie', cookie)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {
            if (err) done(err);

            f._id = res.body._id;
            callback(f, cookie);
        });
}



module.exports.user = user;

function withParentFolder(app, done, callback) {
    authUserInternal(app, done, function (cookie, user) {
        var Folder = mongoose.model('Folder');
        Folder.by({ user: user._id, path: '' }).then(function (folder) {
            if (!folder) done(new Error('User does not have root folder'));

            callback(folder, cookie, user);
        }, done);
    }, user);
}

module.exports.withParentFolder = withParentFolder;
*/