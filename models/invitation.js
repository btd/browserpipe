// Invitation schema

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    validation = require('./validation');

var Invitation;

var errorMsgs = {
    invalid: 'is not valid'
}

var InvitationSchema = new Schema({    
    email: { type: String, required: true, validate: [ /\S+@\S+\.\S/, errorMsgs.invalid], trim: true, lowercase: true},
    reason: { type: String, trim: true, validate: validation.nonEmpty("Reason")},
    accepted: {type: Boolean }
});

InvitationSchema.plugin(require('../util/mongoose-timestamp'));

var qfindOne = function (obj) {
    return Invitation
            .findOne(obj)            
            .exec();
};

InvitationSchema.statics.by = qfindOne;

module.exports = Invitation = mongoose.model('Invitation', InvitationSchema);
