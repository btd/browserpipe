/* jshint node: true */

var _ = require('lodash'),
    q = require('q'),
    Folder = require('../../models/folder'),
    Item = require('../../models/item'),
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
          if(!folder) //parent folder does not exists we cannot create its subfolder
              errors.sendForbidden(res);
          else {
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
                })
                .fail(next);
          }
      })
      .fail(next)// go next to got 500
      .done();
}

//Update folder
exports.update = function (req, res) {
    req.checkBody('label').notEmpty();
    req.checkBody('path').notEmpty();

    var errs = req.validationErrors();
    if(errs) {
      return errors.sendBadRequest(res);
    }
    var folder = req.currentFolder;

    // TODO validation

    Folder.findAllDescendant(req.user, folder.fullPath)
      .then(function(folders) {
        _.merge(folder, _.pick(req.body, 'label', 'path'));

        folders = folders.map(function(f) {
          f.path = folder.fullPath;
          return f;
        });

        return q.all(folders.map(function(f) { return f.saveWithPromise(); }))
          .then(userUpdate.bulkUpdateFolder.bind(null, req.user._id, folders));
      })
      .then(responses.sendModelId(res, folder._id))
      .fail(errors.ifErrorSendBadRequest(res))
      .done();
}

//Delete folder, all its childs folders and remove tag from item
exports.destroy = function (req, res) {
    var folder = req.currentFolder;  

    Folder.findAllDescendant(req.user, folder.fullPath)
      .then(function(allSubFolders) {
        allSubFolders.push(folder);

        //need to find all items that uses this folders
        var removeItems = Item.where('user').equals(req.user).where('folders').in(allSubFolders).execWithPromise()
          .then(function(items) {
            items = items.map(function(i) {
              allSubFolders.forEach(function(f) {
                i.folders.remove(f._id);
              })
              return i;
            });

            userUpdate.bulkUpdateItem(req.user._id, items);
            return q.all(items.map(function(i) {
              return i.saveWithPromise(); }));
          });

        var removeFolders = q.all(allSubFolders.map(function(f) { return f.removeWithPromise(); }))

        return q.all([ removeItems, removeFolders ])
          .then(userUpdate.bulkDeleteFolder.bind(null, req.user._id, allSubFolders));
      })
      .then(responses.sendModelId(res, folder._id))
      .fail(errors.ifErrorSendBadRequest(res))
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
        })
        .fail(next);
}

