var _state = require('../state'),    
    _ = require('lodash'),
    draggable = require('./util/draggable');

module.exports = (function () { 
    
    var options =  {        
        horizontal: false,
        helper: 'selection-draggable',
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
        }
    }

    return draggable(options);

})();