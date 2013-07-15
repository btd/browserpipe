var Cookie = require('cookiejar').Cookie,
    request = require('supertest'),
    mongoose = require('mongoose');

var user = { name: 'User Test', email: 'user@example.com', password: '123456' };

module.exports.authUser = function(app, done, callback) {
    request(app)
        .post('/users')
        .send(user)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {
            //i should be created without errors because we already test it
            //console.warn(res.body);
            var userId = res.body._id;

            var cookie = new Cookie(res.get("set-cookie")[0]);

            var cookieValue = cookie.toValueString();

            request(app)
                .post('/users/session')
                .type('form')
                .send(user)
                .set('Cookie', cookieValue)
                .end(function (err, res) {
                    if(err) done(err);

                    res.redirect.should.be.true;

                    callback(cookieValue, userId);

                });
        });
};

function dropCollection(collectionName, done) {
    mongoose.connection.db.dropCollection(collectionName, function (err, result) {
        done();
    });
}

function dropCollections(collections, done) {
    if(collections.length > 0) {
        dropCollection(collections.shift(), function() {
            dropCollections(collections, done);
        });
    } else {
        done();
    }
}

module.exports.dropCollections = dropCollections;

module.exports.user = user;
