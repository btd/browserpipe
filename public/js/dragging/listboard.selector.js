var _state = require('../state'),    
    _ = require('lodash'),
    draggable = require('./util/draggable'),
    selection = require('../selection/selection');

module.exports = (function () { 
    
    var options =  {   
        horizontal: true,     
        helper: 'selection-draggable',
        start: function (el) { 
            var $el = $(el);            
            if(!$el.hasClass(selection.getClassName())){
                var listboardId = $el.attr('id').substring(3);            
                selection.selectSingleListboard(listboardId);       
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
        dropOverObject: function(el) {
            
        },
        dropOverParent: function(index) {
            
        }
    }

    return draggable(options);

})();