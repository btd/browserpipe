var $ = require('jquery'),
    draggable = require('./util/draggable'),
    selection = require('../selection/selection');

module.exports = (function () { 
    
    var options =  {        
        horizontal: false,
        helper: 'selection-draggable',
        start: function (el) { 
            var $el = $(el);            
            if(!$el.hasClass(selection.getClassName())){
                var folderId = $el.attr('id').substring(7);
                selection.selectSingleFolder(folderId);
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