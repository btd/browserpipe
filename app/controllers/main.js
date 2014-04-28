var Item = require('../../models/item');
var config = require('../../config');

//Home
exports.home = function (req, res, next) {
    if (req.isAuthenticated()) {
        return Item.all({ user: req.user._id, deleted: false }).then(function(items) {
            res.render('main/home', {
                user: req.user,
                items: items,
                config: {
                    appUrl: config.appUrl
                }
            })
        }, next)
    } else
        res.render('main/index')
}



