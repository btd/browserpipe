var _state = require('../state'),    
    _ = require('lodash'),
    draggable = require('./util/draggable');

module.exports = (function () { 
    
    var options =  {        
        horizontal: false,
        helper: 'selection-draggable',
        start: function (el) { 
            var $el = $(el);
            var folderId = $el.attr('id').substring(7);
            var selection = _state.getSelection();     
            if(!_.contains(selection.folders, folderId)){
                _state.clearSelection();
                _state.addOrRemoveSelectedFolder(folderId);
                $('.selection-selected').removeClass('selection-selected');
                $el.addClass('selection-selected');    
            }
            else
                $('.selection-selected').addClass('selection-dragged');
        },
        end: function(el) {
            $('.selection-selected').removeClass('selection-selected selection-dragged');
            _state.clearSelection();
        },
        canBeDropped: function(el) {
            var $el = $(el);
            return !$el.hasClass('selection-selected') &&
                $el.parents('.selection-selected').length === 0
        }
    }

    return draggable(options);

})();