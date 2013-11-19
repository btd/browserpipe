var _state = require('../state'),    
    _ = require('lodash'),
    draggable = require('./util/draggable'),
    selection = require('../selection/selection');

module.exports = (function () { 
    
    var options =  {        
        horizontal: false,
        helper: 'selection-draggable',
        objDroppable: false,
        start: function (el) { 
            var $el = $(el);            
            if(!$el.hasClass(selection.getClassName())){
                var itemId = $el.attr('id').substring(3);
                selection.selectSingleItem(itemId);
            }
            $('.' + selection.getClassName()).addClass('selection-dragged');
        },
        end: function(el) {
            selection.clearSelection();
            $('.' + selection.getClassName()).removeClass('selection-dragged');
        },
        canBeDropped: function(el) {
            return !selection.isElemSelected(el) && !selection.isElemParentSelected(el);                
        },
        dropOverParent: function(index) {
            
        }
    }

    return draggable(options);

})();