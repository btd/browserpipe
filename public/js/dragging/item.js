var _state = require('../state'),    
    _ = require('lodash'),
    draggable = require('./util/draggable');

module.exports = (function () { 
    
    var options =  {        
        horizontal: false,
        helper: 'selection-draggable',
        objDroppable: false,
        start: function (el) { 
            var $el = $(el);
            var itemId = $el.attr('id').substring(3);
            var selection = _state.getSelection();     
            if(!_.contains(selection.items, itemId)){
                _state.clearSelection();
                _state.addOrRemoveSelectedItem(itemId);
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