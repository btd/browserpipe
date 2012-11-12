define([
  'jQuery',
  'underscore',
  'backbone',
  'views/view',
  'views/tags/breadcrumb.item',
  'data/tags',  
  'text!templates/tags/menu.drop.down.text'
], function($, _, Backbone, AppView, TagBreadCrumbItem, tagsData, dropDownTableTemplate){
  var BreadCrumbView = AppView.extend({
    name: 'BreadCrumbView',    
    el: $("#breadcrumb"),
    currentPath: '',
    rootView: {},
    activeViews: [],
    initializeView: function(){  
      //TODO: Remove fake initial containers to test html/css design
      this.fakeData  = new tagsData();    
      this.compiledtemplateDropDownTable = _.template(dropDownTableTemplate)
    },    
    setCurrentPath: function(path, opened){ //Eg. path = development.tools.new
      this.currentPath = path;
      var names = (this.currentPath==""?[]:this.currentPath.split('.'));
      //Loads the tags breadcrumbs view
      var path = '';
      for (i = 0; i < names.length; i++) {
        path = path + (i==0?'':'.') + names[i];
        //If the view does not exist, it creates it
        if(!this.activeViews[i] || this.activeViews[i].getTagPath() != path){
          if(this.activeViews[i] && this.activeViews[i].getTagPath() != path)
            this.removeActiveView(i);
          var tag = this.fakeData.getTag(path);
          this.activeViews[i] = this.addTag(tag, opened);
        } 
        else
          if(opened && i== names.length - 1) //We show the last dropdown
            this.activeViews[i].showDropDown();       
      }
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
      var view = new TagBreadCrumbItem({tag: tag, opened: opened});
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
      if(exception != "root")
        this.rootView.hideDropDown();
      for (i = 0; i < this.activeViews.length; i++) {
        if(exception != this.activeViews[i].getTagPath())
          this.activeViews[i].hideDropDown();
      }
    },
    addRootTag: function(opened){
      var rootTag = this.fakeData.getRoot();
      this.rootView = this.addTag(rootTag, opened);
    },
    renderView: function(){    
      //Create root breadcrumb item
      this.addRootTag(false);
      return this;
    },
    postRender: function(){
      var self = this;
      $('html').on('click.dropdown.data-api', function() {
          self.hideAllDropDowns();
      });
    },
    disable: function(){      
      this.setCurrentPath('', false);
    }
  });
  return BreadCrumbView;
});