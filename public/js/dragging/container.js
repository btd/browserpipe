var $ = require('jquery'),
    draggable = require('./util/draggable'),
    selection = require('../selection/selection');

module.exports = (function () { 
    
    var options =  {        
        horizontal: true,
        helper: 'selection-draggable',
        start: function (el) { 
            var $el = $(el);            
            if(!$el.hasClass(selection.getClassName())){
                var containerId = $el.attr('id').substring(3);                   
                selection.selectSingleContainer(containerId);
            }     
            $('.' + selection.getClassName()).addClass('selection-dragged');   
        },
        end: function() {
            selection.clearSelection();
            $('.' + selection.getClassName()).removeClass('selection-dragged');
        },
        canBeDropped: function(el) {
            return !selection.isElemSelected(el) && !selection.isElemParentSelected(el);                
        },
        dropOverObject: function() {
            
        },
        dropOverParent: function() {
            
        }
        
    }

    return draggable(options);

})();