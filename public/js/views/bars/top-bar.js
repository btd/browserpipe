define([
  'jQuery',
  'underscore',
  'backbone',
  'views/view'
], function($, _, Backbone, AppView){
  var TopBarView = AppView.extend({
    name: 'TopBarView',
    el: $("#top-bar"),    
    activeFilter: 'searchbox',
    initializeView: function(){  
      this.tagsBreadCrumbView = this.options.tagsBreadCrumbView;
      this.searchBoxView = this.options.searchBoxView;  
      this.calculateHeight();    
    },  
    showSearchBox: function($searchBox){    
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
    },
    hideSearchBox: function($searchBox){
      if($searchBox.hasClass('uncompressed')){        
        if(!Modernizr.csstransitions){
          $searchBox.animate({
              opacity: 0.5,
              width: '7px'
            }, 200, function() {
              // Animation complete.
            });
        }
        $searchBox.removeClass('uncompressed').addClass('compressed');
      }
  
    },
    renderView: function(){
      this.tagsBreadCrumbView.render();
      this.searchBoxView.render();     
      return this;
    },
    postRender: function(){
      //Load initial tag, with the dropdown dialog close
      this.prepareEvents();
    },
    prepareEvents: function(){
      var _this = this;     
      window.onresize = function(event) {
        _this.calculateHeight();
      };
      $searchBox = $('#search-box', this.el);
      if(this.activeFilter == 'breadcrumb')
        this.prepareBreadCrumbActiveEvents(_this, $searchBox);
      else
        this.prepareSearchBoxActiveEvents(_this, $searchBox);
      this.tagsBreadCrumbView.on('TagSelected', 
        function($tagDropDown){
          if(_this.activeFilter != 'breadcrumb'){
            _this.prepareBreadCrumbActiveEvents(_this, $searchBox);
          }
        }
      );
      this.searchBoxView.on('SearchBtnClicked', 
        function(){
          if(_this.activeFilter != 'searchBox'){
            _this.prepareSearchBoxActiveEvents(_this, $searchBox);
          }
        }
      );
      this.tagsBreadCrumbView.on('ShowTemporalTag', 
        function(){
          $searchBox.blur(); 
          _this.hideSearchBox($searchBox)
        }
      );       
    },
    prepareBreadCrumbActiveEvents: function(_this, $searchBox){      
      _this.activeFilter = 'breadcrumb';
      _this.hideSearchBox($searchBox)
      console.time('Executing prepareBreadCrumbActiveEvents');
      _this.tagsBreadCrumbView.unbind('HideDropDownMenu');   
      $searchBox.focus(function() {
         _this.showSearchBox($(this));         
      }).focusout(function() {
         _this.hideSearchBox($(this));  
      });
      console.timeEnd('Executing prepareBreadCrumbActiveEvents');
    },
    prepareSearchBoxActiveEvents: function(_this, $searchBox){          
      _this.activeFilter = 'searchbox';
      _this.showSearchBox($searchBox)
      console.time('Executing prepareSearchBoxActiveEvents');
      $searchBox.unbind('focus focusout');        
      this.tagsBreadCrumbView.on('HideDropDownMenu', 
        function($tagDropDown){
          if(!$('.tag-dropdown-menu').is(':visible')) 
            _this.showSearchBox($searchBox)
        }
      );    
      this.tagsBreadCrumbView.collapse();
      console.timeEnd('Executing prepareSearchBoxActiveEvents');  
    },
    calculateHeight: function(){
      var width = $('#account-nav', this.el).width();
      $('#search-form', this.el).css('right', width);
    }
  });
  return TopBarView;
});