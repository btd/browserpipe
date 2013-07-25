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
                res.json(400, err.errors);
            }).done()
            
    }, function() {
        res.send(400, {error: 'Bad request'});
    })
}

//Update list
exports.update = function (req, res) {    
    var list = req.currentList;
    if (req.body.label)
        list.label = req.body.label
    if (req.body.path)
        list.path = req.body.path
    list.saveWithPromise().then(function () {
        res.json({ _id: list._id })
    },function (err) {
        res.json(400, err.errors);
    }).done()        
}

//Delete list, all its childs, containers associated and remove tag from item
exports.destroy = function (req, res) {
    var list = req.currentList;    
    list.removeFull().then(function () {
        res.json({ _id: list._id })
    },function (err) {
        res.json(400, err.errors);
    }).done()        
}

//Find list by id
exports.list = function (req, res, next, id) {
    List.byId(id)
        .then(function(list) {
            if (!list) res.send(404, {error: 'Not found'});
            else {
                req.currentList = list;
                next()
            }
        }).fail(function(err) {
            next(err);
        });
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
