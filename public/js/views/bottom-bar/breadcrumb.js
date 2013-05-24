define([
  'jQuery',
  'underscore',
  'backbone',
  'models/state',
  'views/view',
  'views/bottom-bar/tags/breadcrumb.tag'  
], function($, _, Backbone, _state, AppView, BreadCrumbTag){
  var BreadCrumb = AppView.extend({
    el: $("#breadcrumb"),
    currentFilter: '',
    rootView: {},
    activeViews: [],
    initializeView: function(){        
      this.listenTo(_state.dashboards, 'currentContainerChange', this.currentContainerChanged);
    }, 
    renderView: function(){    
      return this;
    },   
    currentContainerChanged: function(container){
      //If it is a Tag container it navigates to it
      if(!container){
        if(this.activeViews.length == 0)
          this.setCurrentFilter('Tags', false)
      }
      else if(container.get('type') === 1)
        this.setCurrentFilter(container.tag.getFilter(), false);        
    },
    setCurrentFilter: function(filter, opened){ //Eg. filter = Tags/Read Later/Development Tools      
      if(this.currentFilter != filter){
        this.currentFilter = filter;  
        var names = this.currentFilter.split('/');         
        var filter = '';
        //For each item from the filter, we create a BreadCrumbTab view
        for (i = 0; i < names.length; i++) {
          filter = (i==0?"":filter + "/") + names[i];
          this.createBreadCrumbTagView(filter, names, i, opened)
        }  
        $("#bottom-bar").trigger("heightChanged");
      }    
      else if(opened && this.activeViews.length > 0)
        this.activeViews[this.activeViews.length - 1].showDropDown();
    },
    createBreadCrumbTagView: function(filter, names, index, opened){
      //Checks if view exist for that index, if so, it checks if it is the one defined by the filter
      if(!this.activeViews[index] || this.activeViews[index].getTagFilter() != filter){
        //If view extits for that index, but it is not the same filter, then it removes it
        if(this.activeViews[index] && this.activeViews[index].getTagFilter() != filter){
          this.removeActiveView(index);
        }
        //Gets the tag for that filter
        var tag = _state.getTagByFilter(filter)
        //Adds the view to that index
        if(tag)
          this.activeViews[index] = this.addTag(tag, opened);                                                  
      } 
      else //We open the dropdown if it is the last one and opened is set to true
        if(opened && i== names.length - 1)
          this.activeViews[index].showDropDown(); 
      //If it is the last item from the filter and they are remaining views in greater indexes, it removes them
      if(index== names.length - 1)
        this.removeRemainingActiveViews(names);          
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
      this.activeViews[index].dispose();
    },
    addTag: function(tag, opened){
      var self = this;
      var view = new BreadCrumbTag({model: tag, opened: opened});
      $(this.el).append(view.render().el);
      //If a tag dropdown is opened, all other are closed
      this.listenTo(view, 'showDropDown', function(filter){
        self.hideAllDropDowns(filter);      
      });
      this.listenTo(view, 'startNavigateToChildTag', function(filter){
        self.hideAllDropDowns();
        self.setCurrentFilter(filter, true);    
        //No current container when navigating
        _state.dashboards.setCurrentContainer(null);   
        //TODO: optimize if height of the bottom bar really changes
        $("#bottom-bar").trigger("heightChanged");
      });
      return view;
    },
    hideAllDropDowns: function(exception){
      for (i = 0; i < this.activeViews.length; i++) {
        if(exception != this.activeViews[i].getTagFilter())
          this.activeViews[i].hideDropDown();
      }
    },
    postRender: function(){
      var self = this;
      $('html').on('click.dropdown.data-api', function() {
          self.hideAllDropDowns();
      });
    }
  });
  return BreadCrumb;
});