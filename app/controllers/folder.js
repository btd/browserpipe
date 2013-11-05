/* jshint node: true */

var _ = require('lodash'),
    q = require('q'),
    mongoose = require('mongoose'),
    Folder = mongoose.model('Folder'),
    Item = mongoose.model('Item'),
    Folder = mongoose.model('Folder'),
    responses = require('.././responses.js'),
    errors = require('.././errors.js');

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
        var folder = new Folder(_.pick(req.body, 'label', 'path'));
        folder.user = req.user;
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
    var oldPath = folder.fullPath; 
    _.merge(folder, _.pick(req.body, 'label', 'path'));
    var newPath = folder.fullPath;
    
    //Folder and descendants folders and descendant folders path are updated
    var deltaFolders = { type: 'bulk.update.folder', data: [folder] } 

    folder.saveWithPromise()
        .then(Folder.updateFoldersPath(req.user,  oldPath, newPath, deltaFolders))
        .then(responses.sendModelId(res, folder._id))
        .fail(errors.ifErrorSendBadRequest(res))
        .then(updateClients(req, deltaFolders))             
        .done();

}

//Delete folder, all its childs folders and remove tag from item
exports.destroy = function (req, res) {
    var folder = req.currentFolder;  

    var delta = {
        type: 'delete.folder',
        data: folder
    }

    //Folder and descendants folders and descendant folders path are deleted
    var deltaFolders = { type: 'bulk.delete.folder', data: [folder] } 

    //Items with all folders and descendant folders are updated
    var deltaItems = { type: 'bulk.update.item', data: [] } 

    Folder.removeFolderAndDescendants(req.user, folder, deltaFolders, deltaItems)
        .then(responses.sendModelId(res, folder._id))
        .fail(errors.ifErrorSendBadRequest(res))
        .then(updateClients(req, deltaFolders))          
        .then(updateClients(req, deltaItems))  
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
