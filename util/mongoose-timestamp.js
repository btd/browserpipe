module.exports = function(schema) {
    schema.add({
        createdAt: Date,
        updatedAt: Date
    });

    schema.pre('save', function (next) {
        if (!this.createdAt) {
            this.createdAt = this.updatedAt = new Date();
        } else {
            this.updatedAt = new Date();
        }
        next();
    });
};