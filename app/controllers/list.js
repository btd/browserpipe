var _ = require('lodash'),
    q = require('q'),
    mongoose = require('mongoose'),
    List = mongoose.model('List')


//Create list
exports.create = function (req, res) {
    findByFullPath(req.body.path, function() {
        var list = new List({ label: req.body.label, path: req.body.path })
        list.user = req.user

        q.all([list.saveWithPromise()])
            .spread(function () {
                res.json({ _id: list._id })
            },function (err) {
                //TODO: send corresponding number error
                res.json(err.errors)
            }).done()
    }, function() {
        res.send(500, {error: 'Invalid call'});
    })
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


//Find list by full path; returns success for empty path
var findByFullPath = function (fullpath, success, failure) {
    if(fullpath.trim() == "") {
        success()
    }
    else {      
        var label = fullpath; var path = '';
        var index = fullpath.lastIndexOf('/');        
        if(index > 0) {
            path = fullpath.substring(0, index);
            label = fullpath.substring(index + 1);
        }
        List
            .findOne({ label: label, path: path })
            .exec(function (err, list) {
                if (err) return failure(err)
                if (!list) return failure("Not found")
                success(list)
            })        
    }
}

exports.findByFullPath = findByFullPath


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
