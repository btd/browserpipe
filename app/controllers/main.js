var _ = require('lodash'),
    q = require('q'),
    mongoose = require('mongoose')


//Home
exports.home = function (req, res) {
    if (req.isAuthenticated()) {
        if (req.user.currentListboard)
            res.redirect('/listboards/' + req.user.currentListboard._id)
        else
            res.redirect('/listboards') //No listboard
    }
    else
        res.render('main/index')
}

//About
exports.about = function (req, res) {
    res.render('main/about')        
}

