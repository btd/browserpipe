var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ApplicationSchema = new Schema({
    name: { type: String, required: true, trim: true },
    client_id: { type: String, required: true, trim: true}
});//TODO add redirect_uri domain

ApplicationSchema.plugin(require('../util/mongoose-timestamp'));

ApplicationSchema.statics.byClientId = function (client_id) {
    return Application.findOne({ client_id: client_id}).execWithPromise();
};

module.exports = Application = mongoose.model('Application', ApplicationSchema);
