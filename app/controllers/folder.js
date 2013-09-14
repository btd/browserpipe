/* jshint node: true */

var _ = require('lodash'),
    mongoose = require('mongoose'),
    Folder = mongoose.model('Folder'),
    responses = require('../util/responses.js'),
    errors = require('../util/errors.js');

var saveFolder = function(req, res, folder, delta){
    folder.saveWithPromise()
        .then(responses.sendModelId(res, folder._id))
        .fail(errors.ifErrorSendBadRequest(res))  //TODO: what happen when you have then.fail.then??
        .then(updateClients(req, delta))      
        .done();
}

var updateClients = function(req, delta) {
    return function(){
        req.sockets.forEach(function(s) {
            s.emit(delta.type, delta.data);
        });
    }
}

//Create folder
exports.create = function (req, res) {
    findByFullPath(req.body.path, function() {
        console.log(req.body.cid)
        var folder = new Folder(_.pick(req.body, 'label', 'path', 'cid'));
        folder.user = req.user;

        console.log(folder)
        folder.set('cid', req.body.cid);
        console.log(folder)

        var delta = {
            type: 'create.folder',
            data: folder
        }
        
        saveFolder(req, res, folder, delta);
            
    }, function() {
        errors.sendBadRequest(res);
    });
}

//Update folder
exports.update = function (req, res) {    
    var folder = req.currentFolder;
    _.merge(folder, _.pick(req.body, 'label', 'path'));

    //TODO: when a folder is updated
    //a) all descendants folders should be have the path updated
    //b) the folder and the descendant folders should be updated from the items that contains them
    //c) all the future containers that have the folder or folder descendant should be updated

    var delta = {
        type: 'update.folder',
        data: folder
    }
    
    saveFolder(req, res, folder, delta);
}

//Delete folder, all its childs, containers associated and remove tag from item
exports.destroy = function (req, res) {
    var folder = req.currentFolder;  

    var delta = {
        type: 'delete.folder',
        data: folder
    }

    //TODO: when a folder is removed
    //a) all descendants folders should be removed
    //b) the folder and the descendant folders should be removed from the items
    //c) all the future containers that have the folder or folder descendant should be removed

    folder.removeFull()
        .then(responses.sendModelId(res, folder._id))
        .fail(errors.ifErrorSendBadRequest(res))
        .then(updateClients(req, delta))  
        .done()
}

//Find folder by id
exports.folder = function (req, res, next, id) {
    Folder.byId(id)
        .then(function(folder) {
            if (!folder) 
                errors.sendNotFound(res);
            else {
                if (folder.user !=  req.user._id.toString()) 
                    errors.sendForbidden(res);
            else {
                req.currentFolder = folder;
                next()
            }}
        }).fail(function(err) {
            next(err);
        });
}


//Find folder by full path; returns success for empty path
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
        Folder
            .findOne({ label: label, path: path })
            .exec(function (err, folder) {
                if (err) return failure(err)
                if (!folder) return failure("Not found")
                success(folder)
            })        
    }
}

exports.findByFullPath = findByFullPath
