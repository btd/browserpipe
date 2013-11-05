
module.exports.sendModelId = function(res, id) {
    return function() {
        res.json({ _id: id });
    };
};