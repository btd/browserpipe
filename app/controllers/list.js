/* jshint node: true */

var _ = require('lodash'),
    mongoose = require('mongoose'),
    List = mongoose.model('List'),
    responses = require('../util/responses.js'),
    errors = require('../util/errors.js');

//Create list
exports.create = function (req, res) {
    findByFullPath(req.body.path, function() {
        var list = new List(_.pick(req.body, 'label', 'path'));
        list.user = req.user;

        list.saveWithPromise()
            .then(responses.sendModelId(res, list._id))
            .fail(errors.ifErrorSendBadRequest(res))
            .done();
            
    }, function() {
        errors.sendBadRequest(res);
    })
}

//Update list
exports.update = function (req, res) {    
    var list = req.currentList;
    _.merge(list, _.pick(req.body, 'label', 'path'));
    list.saveWithPromise()
        .then(responses.sendModelId(res, list._id))
        .fail(errors.ifErrorSendBadRequest(res))
        .done();      
}

//Delete list, all its childs, containers associated and remove tag from item
exports.destroy = function (req, res) {
    var list = req.currentList;    
    list.removeFull()
        .then(responses.sendModelId(res, list._id))
        .fail(errors.ifErrorSendBadRequest(res))
        .done()
}

//Find list by id
exports.list = function (req, res, next, id) {
    List.byId(id)
        .then(function(list) {
            if (!list) 
                errors.sendNotFound(res);
            else {
                if (list.user !=  req.user._id.toString()) 
                    errors.sendForbidden(res);
            else {
                req.currentList = list;
                next()
            }}
        }).fail(function(err) {
            next(err);
        });
}


//Find list by full path; returns success for empty path
var findByFullPath = function (fullpath, success, failure) {
    if(fullpath.trim() === "") {
        success();
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
