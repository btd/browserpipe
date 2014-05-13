// Invitation schema

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Invitation;

var InvitationSchema = new Schema({
    email: { type: String, trim: true, lowercase: true},
    reason: { type: String, trim: true },
    accepted: {type: Boolean }
});

InvitationSchema.plugin(require('../util/mongoose-timestamp'));
InvitationSchema.plugin(require('../util/mongoose-query'));
InvitationSchema.plugin(require('../util/mongoose-patch'));

module.exports = Invitation = mongoose.model('Invitation', InvitationSchema);
