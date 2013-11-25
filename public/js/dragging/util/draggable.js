var _ = require('lodash'),
    $ = require('jquery');

//Parent: where the draggable objects are and accept drop of them and other draggable objects
//Object: are the draggable objects and accept drop of other objects

module.exports = function (options) {

    options = _.extend({
        horizontal: true, //Defines how the parents display it objects
        objDroppable: true, //Defines if the object accept drop of other objects
        connectWith: false //TODO: Not used, I leave it here to evaluate the use of it in the future.
    }, options);  

    var placeholder;

    //Detects if CTRL key is pressed
    var isCopying = function(e) {   
        var dt = e.nativeEvent.dataTransfer;  
        //Chrome and firefox report it differently :|
        if(dt.effectAllowed === 'copy' || dt.dropEffect === 'copy') return true;
        else return false;
    }

     //Needed because html5 drag and drop sucks: http://www.quirksmode.org/blog/archives/2009/09/the_html5_drag.html
    var isDraggable = function (elem) { return $(elem).attr('draggable')==='true' }
    var isDraggableParent = function (elem) { return  $(elem).children('[draggable=true]').length > 0 ; }
    var getDraggable = function(e) {        
        if(isDraggable(e.target))
            return $(e.target);
        var parents = $(e.target).parents('[draggable=true]');   
        return (parents.length > 0 ? $(parents[0]) : null);
    };
    
    //Placeholder helpers
    var isPlaceHolderAttached = function () { return $.contains(document.documentElement, placeholder[0]) }
    var isInsidePlaceHolder = function(e) {
        if(!placeholder || !isPlaceHolderAttached()) return false;
        return (                     
            placeholder.offset().left <= e.pageX &&
            (placeholder.offset().left + placeholder.width()) >= e.pageX &&
            placeholder.offset().top <= e.pageY &&
            (placeholder.offset().top + placeholder.height()) >= e.pageY            
        );
    }
    var deAttachPlaceHolder = function() { if(placeholder) placeholder.detach(); }
    var deAttachAllPlaceHolders = function() { $('.sortable-placeholder').detach(); }       
    
    //Drag and drop functions   

	var objDragStart = function(e) {
        var $this = getDraggable(e); 
        if(!$this) return false;
        e.stopPropagation();
        if (options.start) {            
            options.start(e.target);
        }                
        var dt = e.nativeEvent.dataTransfer;                  
        if(options.helper) {    
            $(options.helper).show();
            dt.setDragImage(document.getElementById(options.helper),60,30);                     
        }           
        dt.effectAllowed = 'all';           
        dt.setData('Text', 'dummy');
    }

    var objDragEnd = function(e) {     
        var $this = getDraggable(e); 
        if(!$this) return false;                
        if (options.end) {            
            options.end(e.target);
        }         
    }
    var objDragOverOrEnter = function(e) {           
        e.preventDefault();     
        e.stopPropagation();  
        if(options.objDroppable) {
            var $this = getDraggable(e); 
            if(!$this) return false;   
            $('.selection-droppable').removeClass('selection-droppable selection-droppable-copy selection-droppable-move')                
            if(options.canBeDropped && options.canBeDropped(e.target)) {
                $this.addClass('selection-droppable')
                if(isCopying(e))
                    $this.addClass('selection-droppable-copy');
                else
                    $this.addClass('selection-droppable-move');               
            }
            return false;
        }
        else
            return true;
    }

    var objDragLeave = function(e) {           
        e.preventDefault();  
        e.stopPropagation();
        if(!isDraggable(e.target)) return false;
        var $this = getDraggable(e);         
        $this.removeClass('selection-droppable selection-droppable-copy selection-droppable-move');
    };

    var objDrop = function(e) {        
        e.preventDefault();
        e.stopPropagation();
        $('.selection-droppable').removeClass('selection-droppable selection-droppable-copy selection-droppable-move');
        deAttachAllPlaceHolders();
        var $this = getDraggable(e); 
        if(!$this) return false;        
        if(options.dropOverObject)
            options.dropOverObject($this);
        return false;
    }

    var parentDragOverOrEnter = function(e) {                 
        e.stopPropagation(); 
        e.preventDefault();       
        if(placeholder)
            if(isCopying(e))
                placeholder.children('.text').html('copy here');
            else
                placeholder.children('.text').html('move here');  
        if(!isDraggableParent(e.target)) return false;                           
        if(options.canBeDropped && options.canBeDropped(e.target)) {
            var $this = $(e.target);                        
            if(!placeholder)
                placeholder = $('<' + (/^ul|ol$/i.test(e.target.tagName) ? 'li' : 'div') + ' class="sortable-placeholder"><div class="text"></div></' + (/^ul|ol$/i.test(e.target.tagName) ? 'li' : 'div')  + '>');                                                               
            if(!isPlaceHolderAttached()){
                var leftItem = $this.children().filter(function () {
                   return (
                            (options.horizontal && $(this).offset().left > e.nativeEvent.pageX) ||
                            (!options.horizontal && $(this).offset().top  > e.nativeEvent.pageY)
                        );
                });        
                if(leftItem.length > 0)                
                    $(leftItem[0]).before(placeholder);            
                else
                    $this.append(placeholder);            
            }        
        }
    }

    var parentDragLeave =  function(e) {     
        e.preventDefault();   
        e.stopPropagation(); 
        if(!isInsidePlaceHolder(e)) 
            deAttachPlaceHolder();      
    }

    var parentDrop = function(e) {
        e.preventDefault();
        e.stopPropagation();    
        $('.selection-droppable').removeClass('selection-droppable selection-droppable-copy selection-droppable-move');
        if(options.dropOverParent)
            options.dropOverParent(placeholder.index());
        deAttachAllPlaceHolders();
    }

	return  {        
		objDragStart: objDragStart,
        objDragEnd: objDragEnd,
        objDragOver: objDragOverOrEnter,
        objDragEnter: objDragOverOrEnter,
        objDragLeave: objDragLeave,
        objDrop: objDrop,
        parentDragOver: parentDragOverOrEnter,
        parentDragEnter: parentDragOverOrEnter,
        parentDragLeave: parentDragLeave,
        parentDrop: parentDrop
	}

};