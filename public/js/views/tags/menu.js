define([
  'jQuery',
  'underscore',
  'backbone',
  'views/tags/menu.item'
], function($, _, Backbone, TagsMenuItemView){
  var TagsMenuView = Backbone.View.extend({
    el: $("#tag-menu"),
    events: {
      'click #btn-add-tag': 'addTagBtnClicked',
    },   
    initialize: function(){  
      this.collection.bind("reset", this.render);
      this.collection.on("add", this.addItem);         
      this.collection.on("change:selected", this.changeSelected, this);
    }, 
    addItem: function( model ){      
      
    },
    addTagBtnClicked: function(e){
      e.preventDefault();
      this.trigger('onShowAddTag', this.collection.selectedTag);
    },
    changeSelected: function( model, val, options){ 
      //Checks only if the change corresponds to the selected one, to avoid been called twice
      if(val){
        this.collection.selectedTag.set({selected: false});      
        this.collection.selectedTag = model;
        this.trigger('onChangeSelectedTag', this.collection.selectedTag);
      }
    },
    render: function(){
      _.each(this.collection.models, function (tag) {
        var tagEl = new TagsMenuItemView({model: tag}).render().el
        $('.nav:first', this.el).append(tagEl);
      }, this);

      $('#btn-add-tag').tooltip();   

      return this;
    }
  });
  return TagsMenuView;
});
