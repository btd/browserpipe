/* jshint node: true */

var _ = require('lodash'),
    responses = require('../responses'),
    errors = require('../errors');

var userUpdate = require('./user_update');

var saveContainer = function(req, res, container){
    return req.user.saveWithPromise()
        .then(userUpdate.createItem.bind(null, req.user._id, container))
        .then(responses.sendModelId(res, container._id))
        .fail(errors.ifErrorSendBadRequest(res));
}

//Create container
exports.create = function (req, res) {
    //req.checkBody('title').notEmpty(); it can be empty

    var errs = req.validationErrors();
    if(errs) {
        return errors.sendBadRequest(res);
    }

    var container = req.listboard.addContainer(_.pick(req.body, 'title'));

    saveContainer(req, res, container)
      .then(userUpdate.updateListboard.bind(null, req.user._id, req.listboard))
      .done();
}

//Update container
exports.update = function (req, res) {
    var container = req.listboard.containers.id(req.params.containerId);

    if (container) {
        _.merge(container, _.pick(req.body, 'title')); //it works because by reference it is the same object!

        saveContainer(req, res, container)
          .then(userUpdate.updateContainer.bind(null, req.user._id, req.listboard._id, container))
          .done();
    } else
        errors.sendNotFound(res);
}


//Delete container
exports.destroy = function (req, res) {
    var container = req.listboard.containers.id(req.params.containerId);
    if (container) {
        container.remove();

        saveContainer(req, res, container)
          .then(userUpdate.deleteContainer.bind(null, req.user._id, req.listboard._id, container))
          .done();
    } else
        errors.sendNotFound(res);
}
    
//Move items to the container
exports.copymoveitems = function(req, res) {
  var container = req.listboard.containers.id(req.params.containerId);

  req.checkBody('action').notEmpty();    
  req.checkBody('items').notEmpty();    

  var errs = req.validationErrors();
  if(errs) {
    return errors.sendBadRequest(res);
  }

  var action = req.body.action;
  var items = req.body.items;

  _.each(items, function(item) { 
    if(!container.containItemId(item))
        container.addItemId(item); 
  });  
  if(action === 'move'){
    //TODO: remove item from previous holder when merging container and containers
  }

  saveContainer(req, res, container)
    .then(userUpdate.updateContainer.bind(null, req.user._id, req.listboard._id, container))
    .done();

}