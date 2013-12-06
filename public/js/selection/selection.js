var _state = require('../state'),    
    _ = require('lodash'),
    $ = require('jquery');

var msg, className = 'selection-selected';

var unSelectContainerItemsOfListboard = function(listboard) {
    _.each(listboard.containers, function(container) {
        _state.removeContainerFromSelection(container._id);
        unSelectItemsContainer(container);
    });
};

var unSelectItemsContainer = function(container) {
    var itemIdsToRemove = _.map(_state.getSelectedItems(), function(item) {              
        if(_.contains(item.containers, container._id))
                return item._id;                
    });
    _.each(_.compact(itemIdsToRemove), function(id) {
        _state.removeItemFromSelection(id);
    });
};

var selectAllButContainer = function(listboard, container) {        
    _state.removeListboardFromSelection(listboard._id);
    _.each(listboard.containers, function(cont) {            
        if(cont != container)
            _state.addContainerToSelection(cont);
    });
};

var selectAllButItem = function(container, item){        
    _state.removeContainerFromSelection(container._id);
    _.each(container.items, function(it) {
        if(it != item)
            _state.addItemToSelection(it);
    });
};

var hideMessage = function() {
    if(msg)
        msg.hide();
};

var showMessage = function(text) {  
    if(!msg){
        msg = Messenger().post({
          message: text,
          type: 'info',
          hideAfter: false,
          actions: {
            cancel: {
              label: 'clear',
              action: function() {
                _state.clearSelection();
                hideMessage();
              }
            },
            view: {
              label: 'view',
              action: function() {
                module.exports.handleViewClick();
              }
            },
            move: {
              label: 'move here',
              action: function() {
                console.log('moved')
                _state.clearSelection();
                hideMessage();
              }
            },
            copy: {
              label: 'copy here',
              action: function() {
                console.log('copiedd')
                _state.clearSelection();
                hideMessage();
              }
            }
          }
        });
    }
    else
        msg.update({
          message: text
        });
}

var getSelectionText =  function(count, singularText, pluralText) {
    return count > 0 ? (" (" + count + " " + (count > 1 ? pluralText : singularText) + ")") : "";
};

module.exports.setHandleViewClick = function(callback) {
    this.handleViewClick = callback;
}


module.exports.getSelectedListboardById = function(id) {
    return _state.getSelectedListboardById(id);
}

module.exports.getSelectedContainerById = function(id) {
    return _state.getSelectedContainerById(id);
}

module.exports.getSelectedItemById = function(id) {
    return _state.getSelectedItemById(id);
}

module.exports.getSelectedFolderById = function(id) {
    return _state.getSelectedFolderById(id);
}

module.exports.clearSelection = function() {
    _state.clearSelection();
    this.updateSelectionMessage();
}

module.exports.selectListboard = function(id){            
    var listboard = _state.getListboardById(id);
    //As we select the listboard, no need to its containers and items on the selection
    unSelectContainerItemsOfListboard(listboard);
    _state.addListboardToSelection(listboard);
    this.updateSelectionMessage();
}

module.exports.unSelectListboard = function(id){
    _state.removeListboardFromSelection(id);
    this.updateSelectionMessage();
}

module.exports.selectContainer = function(id){       
    var container = _state.getContainerById(id);                
    //As we select the container, no need to have its items on the selection
    unSelectItemsContainer(container);
    _state.addContainerToSelection(container);
    this.updateSelectionMessage();
}

module.exports.unSelectContainer = function(id){
    var container = this.getSelectedContainerById(id);                
    if(container)
        _state.removeContainerFromSelection(id);
    else {
        container = _state.getContainerById(id);                
        var listboard = this.getSelectedListboardById(container.listboardId);
        if(listboard)//listboard was selected
            //select the all but container in listboard                    
            selectAllButContainer(listboard, container);
    }
    this.updateSelectionMessage();
}

module.exports.selectItem = function(id){
    var item = _state.getItemById(id);
    _state.addItemToSelection(item);
    this.updateSelectionMessage();
}

module.exports.unSelectItem = function(id){
    var item = this.getSelectedItemById(id);                
    if(item)
        _state.removeItemFromSelection(id);
    else {
        var that = this;
        //If was not in selection but selected, is because its listboard or container was selected                
        item = _state.getItemById(id);                        
        _.each(item.containers, function(containerId) {
            var container = that.getSelectedContainerById(containerId);
            if(container) { //container's was selected
                //select the all but item in container
                selectAllButItem(container, item);
            }
            else { 
                container = _state.getContainerById(containerId);
                var listboard = that.getSelectedListboardById(container.listboardId);
                if(listboard) { //listboard was selected
                    //select the all but item in listboard
                    selectAllButItem(container, item);
                    selectAllButContainer(listboard, container);                    
                }
            }                    
        });
    }
    this.updateSelectionMessage();
}

module.exports.selectFolder = function(id){
    var folder = _state.getFolderById(id);
    _state.addFolderToSelection(folder);
    this.updateSelectionMessage();
}

module.exports.unSelectFolder = function(id){            
    _state.removeFolderFromSelection(id);
    this.updateSelectionMessage();
}

module.exports.selectSingleListboard = function(id) {
    this.clearSelection();
    var listboard = _state.getListboardById(id);      
    _state.addListboardToSelection(listboard);
    this.updateSelectionMessage();
}

module.exports.selectSingleContainer = function(id) {
    this.clearSelection();
    var container = _state.getContainerById(id);      
    _state.addContainerToSelection(container);
    this.updateSelectionMessage();
}

module.exports.selectSingleItem = function(id) {
    this.clearSelection();
    var item = _state.getItemById(id);      
    _state.addItemToSelection(item);
    this.updateSelectionMessage();
}

module.exports.selectSingleFolder = function(id) {
    this.clearSelection();
    var folder = _state.getFolderById(id);      
    _state.addFolderToSelection(folder);
    this.updateSelectionMessage();
}

module.exports.getClassName = function() {
    return className;
}

module.exports.isListboardSelected = function(id) {
    return this.getSelectedListboardById(id)? true : false;
}

module.exports.isContainerSelected = function(id) {            
    return this.getSelectedContainerById(id)? true : false;
}

module.exports.isItemSelected = function(id) {
    return this.getSelectedItemById(id)? true : false;
}

module.exports.isFolderSelected = function(id) {            
    return this.getSelectedFolderById(id)? true : false;
}

module.exports.isElemSelected = function(el) {
    return $(el).hasClass(this.getClassName());
}

module.exports.isElemParentSelected = function(el) {
    return $(el).parents('.' + this.getClassName()).length > 0;
}

module.exports.getSelectionsText = function() {    
    var selection = _state.getSelection();
    var listboardText = '', containerText = '', itemText = '', folderText = '';
    var listboardCount = selection.listboards.length;    
    var containerCount = selection.containers.length;
    var itemCount = selection.items.length;
    var folderCount = selection.folders.length;
    if((listboardCount + containerCount + itemCount + folderCount) > 0) {
        listboardText = getSelectionText(listboardCount, "listboard",  "listboards");
        containerText = getSelectionText(containerCount, "container",  "containers");
        itemText = getSelectionText(itemCount, "item",  "items");
        folderText = getSelectionText(folderCount, "folder",  "folders");
    }
    return [listboardText, containerText, itemText, folderText]
}

module.exports.updateSelectionMessage = function() {
    var result = this.getSelectionsText();
    var listboardText = result[0];
    var containerText = result[1];
    var itemText = result[2];
    var folderText = result[3];
    var text = listboardText + containerText + itemText + folderText;
    if(text)
        showMessage("Selected: " + text);
    else
        hideMessage();           

}