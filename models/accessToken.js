var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var AccessToken;

var AccessTokenSchema = new Schema({
    application: { type: Schema.ObjectId, ref: 'Application', required: true},
    value: { type: String, required: true, trim: true },
    user: { type: Schema.ObjectId, ref: 'User', required: true}
});

AccessTokenSchema.plugin(require('../util/mongoose-timestamp'));

AccessTokenSchema.statics.byUserAndApplication = function(user, application) {
    return AccessToken.findOne({user: user, application: application}).execWithPromise();
};

AccessTokenSchema.statics.by = function(findQuery) {
    return AccessToken.findOne(findQuery).execWithPromise();
};

module.exports = AccessToken = mongoose.model('AccessToken', AccessTokenSchema);

