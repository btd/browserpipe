define([
  'jQuery',
  'underscore',
  'backbone',
  'views/view'
], function($, _, Backbone, AppView){
  var SearchBox = AppView.extend({
    name: 'SearchBox',
    el: $("#search-form"),     
    events: {
      "focus #search-box" : "searchBoxEntered",
      "click #search-btn" : "searchBtnClicked"
    }, 
    initializeView: function(){ 
    },     
    renderView: function(){
      return this;    
    },
    postRender: function(){
      var _this = this;   
    },
    searchBtnClicked: function(e){     
      e.preventDefault();
      var query = $('#search-box', this.el).val();
      this.executeSearch(query);
      //Triggers the event that a search btn is clicked
      this.trigger('searchExecuted', query);
    },
    searchBoxEntered: function(){
      this.enable('');
      this.trigger('searchBoxFocus');
    },
    executeSearch: function(query){
      console.time('Searching for "' + query + '"');
      console.timeEnd('Searching for "' + query + '"'); 
    },
    enable: function(query){    
      var $searchBox = $("#search-box", this.el)
      if($searchBox.hasClass('compressed')){        
        if(!Modernizr.csstransitions){
          $searchBox.animate({
              opacity: 1,
              width: '600px'
            }, 200, function() {
              // Animation complete.
            }); 
        }  
        $searchBox.removeClass('compressed').addClass('uncompressed');
      }
      $searchBox.val(query);
    },
    disable: function(){
      var $searchBox = $("#search-box", this.el)
      if($searchBox.hasClass('uncompressed')){        
        if(!Modernizr.csstransitions){
          $searchBox.animate({
              opacity: 0.5,
              width: '7px'
            }, 200, function() {
              // Animation complete.
            });
        }
        $searchBox.removeClass('uncompressed').addClass('compressed').val('');
      }  
    },
  });
  return SearchBox;
});