/* jshint node: true */

var _ = require('lodash'),
    q = require('q'),
    Folder = require('../../models/folder'),    
    responses = require('../responses'),
    errors = require('../errors');

var userUpdate = require('./user_update');

var saveFolder = function(req, res, folder){
    return folder.saveWithPromise()
        .then(responses.sendModelId(res, folder._id))
        .fail(errors.ifErrorSendBadRequest(res))
}

function splitFullPath(fullPath) {
  var idx = fullPath.lastIndexOf('/');
  return idx > 0 ? {
    label: fullPath.substring(idx + 1),
    path: fullPath.substring(0, idx)
  } : {
    label: fullPath,
    path: ''
  };
}

//Create folder
exports.create = function (req, res, next) {
    req.checkBody('label').notEmpty();
    req.checkBody('path').notEmpty();

    var errs = req.validationErrors();
    if(errs) {
      return errors.sendBadRequest(res);
    }

    //parent folder should exist
    var parentFolder = splitFullPath(req.body.path);
    parentFolder.user = req.user;
    Folder
      .by(parentFolder)
      .then(function(folder) {
          if(!folder) {//parent folder does not exists we cannot create its subfolder
              errors.sendForbidden(res);
          } else {
              // check that we already does not have the same folder
              Folder
                .by({ user: req.user, label: req.body.label, path: req.body.path })
                .then(function(subFolder) {
                  if(!subFolder) {
                    subFolder = folder.createChildFolder(req.body.label);
                    saveFolder(req, res, subFolder)
                      .then(userUpdate.createFolder.bind(null, req.user._id, subFolder));
                  } else {
                    errors.sendForbidden(res);
                  }
                }, next);
          }
      }, next)// go next to got 500
      .done();
}

var updateDescendants = function(req, oldPath, folder) {  
  return Folder.findAllDescendant(req.user, oldPath)
    .then(function(folders) {
      
      var updatedFolders = folders.map(function(f) {
        f.path = f.path.replace(oldPath, folder.fullPath);
        return f;
      });

      var promises = updatedFolders.map(function(f) { return f.saveWithPromise(); });

      return q.all(promises).then(userUpdate.bulkUpdateFolder.bind(null, req.user._id, updatedFolders));
    })
}

//Update folder
exports.update = function (req, res) {

  req.checkBody('label').notEmpty();    

  var errs = req.validationErrors();
  if(errs) {
    return errors.sendBadRequest(res);
  }
  var folder = req.currentFolder;
  var oldPath = folder.fullPath;

  _.merge(folder, _.pick(req.body, 'label'));

  saveFolder(req, res, folder)
    .then(userUpdate.updateFolder.bind(null, req.user._id, folder))        
    .then(updateDescendants(req, oldPath, folder))
    .done();      
}

//Delete folder, all its childs folders
exports.destroy = function (req, res) {
    var folder = req.currentFolder;  

    Folder.findAllDescendant(req.user, folder.fullPath)
      .then(function(allSubFolders) {        
        allSubFolders.push(folder);  
        return q.all(allSubFolders.map(function(f) { return f.removeWithPromise() }))
                .then(userUpdate.bulkDeleteFolder.bind(null, req.user._id, allSubFolders));
      })
      .then(responses.sendModelId(res, folder._id))
      .fail(errors.ifErrorSendBadRequest(res))
      .done()
}

//Move items to the folder
exports.copymoveitems = function(req, res) {
  var folder = req.currentFolder;  

  req.checkBody('action').notEmpty();    
  req.checkBody('items').notEmpty();    

  var errs = req.validationErrors();
  if(errs) {
    return errors.sendBadRequest(res);
  }

  var action = req.body.action;
  var items = req.body.items;

  _.each(items, function(item) { 
    if(!folder.containItemId(item))
      folder.addItemId(item);     
  } );  
  if(action === 'move'){
    //TODO: remove item from previous holder when merging container and folders
  }

  saveFolder(req, res, folder)
  //TODO: optimize here only send the difference in items instead of sending all items again
    .then(userUpdate.updateFolder.bind(null, req.user._id, folder))            
    .done();   
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
        })
        .fail(next);
}

