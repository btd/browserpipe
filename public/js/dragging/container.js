var _state = require('../state'),    
    _ = require('lodash'),
    draggable = require('./util/draggable');

module.exports = (function () { 
    
    var options =  {        
        horizontal: true,
        helper: 'selection-draggable',
        start: function (el) { 
            var $el = $(el);
            var containerId = $el.attr('id').substring(3);                          
            var selection = _state.getSelection();     
            if(!_.contains(selection.containers, containerId)){
                _state.clearSelection();
                _state.addOrRemoveSelectedContainer(containerId);
                $('.selection-selected').removeClass('selection-selected');
                $el.addClass('selection-selected');                
            }
        }
    }

    return draggable(options);

})();