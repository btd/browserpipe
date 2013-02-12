define([
  'jQuery',
  'underscore',
  'backbone',
  'util',
  'models/state',
  'views/view',
  'views/tags/breadcrumb.tag'  
], function($, _, Backbone, Util, _state, AppView, BreadCrumbTag){
  var BreadCrumbView = AppView.extend({
    name: 'BreadCrumbView',    
    el: $("#breadcrumb"),
    currentPath: '',
    rootView: {},
    activeViews: [],
    initializeView: function(){        
    },    
    setCurrentPath: function(path, opened){ //Eg. path = development.tools.new      
      if(this.currentPath != path){
        var self = this;     
        this.currentPath = path;      
        var names = this.currentPath.split('.'); 
        //Loads the tags breadcrumbs view
        var path = '';
        for (i = 0; i < names.length; i++) {
          path = (i==0?"":path + ".") + names[i];
          //If the view does not exist, it creates it
          if(!this.activeViews[i] || this.activeViews[i].getTagPath() != path){
            if(this.activeViews[i] && this.activeViews[i].getTagPath() != path)
              this.removeActiveView(i);
            _state.getTag(path, {
              success: function(tag){                
                self.activeViews[i] = self.addTag(tag, opened);                                
                if(i== names.length - 1) { 
                  self.removeRemainingActiveViews(names);
                }
              }, 
              error: function(err){        
                //TODO: manage the error
                console.log(err)
              }
            });      
          } 
          else //We show the last dropdown
            if(opened && i== names.length - 1)
              this.activeViews[i].showDropDown(); 
        }  
      }    
    },
    removeRemainingActiveViews: function(names){
      //Cleans the rest of the old activeViews
      for (i = names.length; i < this.activeViews.length; i++) {
        this.removeActiveView(i);   
      }
      //The array removing cannot be done inside the loop
      if(this.activeViews.length > names.length)
        this.activeViews.splice(names.length, this.activeViews.length - names.length);
    },
    removeActiveView: function(index){      
      $(this.activeViews[index].el).remove();
      this.activeViews[index].close();
    },
    addTag: function(tag, opened){
      var self = this;
      var view = new BreadCrumbTag({tag: tag, opened: opened});
      $(this.el).append(view.render().el);
      view.on('showDropDown', 
        function(path){
          self.hideAllDropDowns(path);      
        }
      );
      view.on('startNavigateToChild', 
        function(path){
          self.hideAllDropDowns();
          self.setCurrentPath(path, true); 
          self.trigger('startTagNavigation');         
        }
      );
      view.on('selectChild', 
        function(path){
          self.hideAllDropDowns();
          self.setCurrentPath(path, false);
          self.trigger('selectTag', path);
        }
      );
      return view;
    },
    hideAllDropDowns: function(exception){
      for (i = 0; i < this.activeViews.length; i++) {
        if(exception != this.activeViews[i].getTagPath())
          this.activeViews[i].hideDropDown();
      }
    },
    renderView: function(){    
      //Create root breadcrumb item
      this.setCurrentPath('root', false);
      return this;
    },
    postRender: function(){
      var self = this;
      $('html').on('click.dropdown.data-api', function() {
          self.hideAllDropDowns();
      });
    },
    disable: function(){      
      this.renderView();
    }
  });
  return BreadCrumbView;
});