var _ = require('lodash'),
    q = require('q'),
    mongoose = require('mongoose'),
    List = mongoose.model('List')


//Create list
exports.create = function (req, res) {
    if (req.isAuthenticated()) {
        var list = new List(req.body)
        list.user = req.user
        q.all([list.saveWithPromise()])
            .spread(function () {
                res.json({ _id: list._id })
            },function (err) {
                //TODO: send corresponding number error
                res.json(err.errors)
            }).done()
    }
    else
        res.send("invalid request")
}

//Update list
exports.update = function (req, res) {
    if (req.isAuthenticated() && req.currentList) {
        var list = req.currentList;
        if (req.body.label)
            list.label = req.body.label
        if (req.body.path)
            list.path = req.body.path
        list.saveWithPromise().then(function () {
            res.json({ _id: list._id })
        },function (err) {
            //TODO: send corresponding number error
            res.json(err.errors)
        }).done()
    }
    else
        res.send("invalid request")
}

//Find list by id
exports.list = function (req, res, next, id) {
    List
        .findOne({ _id: id })
        .exec(function (err, list) {
            if (err) return next(err)
            req.currentList = list
            next()
        })
}


// Listing of Lists
/*exports.index = function(req, res){
 List
 .find({user: req.user})
 //.populate('user', 'label', 'path')
 .sort({'path': -1}) // sort by date
 // .limit(perPage)
 // .skip(perPage * page)
 .exec(function(err, lists) {
 // TODO manage errors propertly
 if (err) throw err
 res.send(lists)
 })
 }*/

/*// Get a list and its children
 exports.getListAndChildren = function(req, res){
 var parentPath = _.initial(req.listPath.path.substring(0, req.listPath.path.length - 1).split(".")).join(".");
 List.getListAndChildrenByPath(req.user, parentPath, req.listPath, function(lists){
 res.send(lists)
 }, function(err) {
 throw err
 })
 }*/

/*// Delete an list
 exports.destroy = function(req, res){
 var list = req.list
 list.remove(function(err){
 // req.flash('notice', 'Deleted successfully')
 res.redirect('/lists')
 })
 }*/
