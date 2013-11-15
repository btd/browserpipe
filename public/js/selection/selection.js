var _state = require('../state'),    
    _ = require('lodash');

module.exports = (function () {  

    var className = 'selection-selected';

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
    
    return {        
        getSelectedListboardById: function(id) {
            return _state.getSelectedListboardById(id);
        },
        getSelectedContainerById: function(id) {
            return _state.getSelectedContainerById(id);
        },
        getSelectedItemById: function(id) {
            return _state.getSelectedItemById(id);
        },
        getSelectedFolderById: function(id) {
            return _state.getSelectedFolderById(id);
        },
        clearSelection: function() {
            _state.clearSelection();
        },
        selectListboard: function(id){            
            var listboard = _state.getListboardById(id);
            //As we select the listboard, no need to its containers and items on the selection
            unSelectContainerItemsOfListboard(listboard);
            _state.addListboardToSelection(listboard);
        },
        unSelectListboard: function(id){
            _state.removeListboardFromSelection(id);
        },
        selectContainer: function(id){       
            var container = _state.getContainerById(id);                
            //As we select the container, no need to have its items on the selection
            unSelectItemsContainer(container);
            _state.addContainerToSelection(container);
        },
        unSelectContainer: function(id){
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
        },
        selectItem: function(id){
            var item = _state.getItemById(id);
            _state.addItemToSelection(item);
        },
        unSelectItem: function(id){
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
                        var container = _state.getContainerById(containerId);                      
                        var listboard = that.getSelectedListboardById(container.listboardId);
                        if(listboard) { //listboard was selected
                            //select the all but item in listboard
                            selectAllButItem(container, item);
                            selectAllButContainer(listboard, container);                    
                        }
                    }                    
                });
            }
        },
        selectFolder: function(id){
            var folder = _state.getFolderById(id);
            _state.addFolderToSelection(folder);
        },
        unSelectFolder: function(id){            
            _state.removeFolderFromSelection(id);
        },
        selectSingleListboard: function(id) {
            this.clearSelection();
            var listboard = _state.getListboardById(id);      
            _state.addListboardToSelection(listboard);
        },
        selectSingleContainer: function(id) {
            this.clearSelection();
            var container = _state.getContainerById(id);      
            _state.addContainerToSelection(container);
        },
        selectSingleItem: function(id) {
            this.clearSelection();
            var item = _state.getItemById(id);      
            _state.addItemToSelection(item);
        },
        selectSingleFolder: function(id) {
            this.clearSelection();
            var folder = _state.getFolderById(id);      
            _state.addFolderToSelection(folder);
        },         
        getClassName: function() {
            return className;
        },
        isListboardSelected: function(id) {
            return this.getSelectedListboardById(id)? true : false;
        },
        isContainerSelected: function(id) {            
            return this.getSelectedContainerById(id)? true : false;
        },
        isItemSelected: function(id) {
            return this.getSelectedItemById(id)? true : false;
        },
        isFolderSelected: function(id) {            
            return this.getSelectedFolderById(id)? true : false;
        },
        isElemSelected: function(el) {
            return $(el).hasClass(className);
        },
        isElemParentSelected: function(el) {
            return $(el).parents('.' + className).length === 0;
        }
        
    }

})();