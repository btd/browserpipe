var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    config = require('../config');

var AuthCodeSchema = new Schema({
    application: { type: Schema.ObjectId, ref: 'Application'},
    value: { type: String, required: true, trim: true },
    user: { type: Schema.ObjectId, ref: 'User'},
    redirect_uri: { type: String, required: true, trim: true },
    expires_in: { type: Number, default: function() {
        return new Date().getTime() + config.oauth2.authCode.expires_in
    }}
});

AuthCodeSchema.plugin(require('../util/mongoose-timestamp'));

AuthCodeSchema.methods.expired = function() {
    return this.expires_in < (new Date()).getTime();
};

AuthCodeSchema.statics.byUserAndApplication = function(user, application) {
    return AuthCode.findOne({user: user, application: application}).execWithPromise();
};

AuthCodeSchema.statics.by = function(findQuery) {
    return AuthCode.findOne(findQuery).execWithPromise();
};


module.exports = AuthCode = mongoose.model('AuthCode', AuthCodeSchema);


