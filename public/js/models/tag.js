define([
  'underscore',
  'backbone',
  'models/model',
  'collections/tags'
], function(_, Backbone, AppModel, TagCollection) {
  var Tag = AppModel.extend({
    urlRoot: "/tags",
    defaults: {  
    },
    initialize: function(spec){  
      //TODO: on save do not send the children attribute
      this.set('children', new TagCollection());
      //If filter changes, it updates children and triggers filterChanged event
      this.on('change', function(){
        if(this.hasChanged('label') || this.hasChanged('path')){
          var newFilter = this.getFilter();
          var oldFilter = (this.previous('path')===""?"":this.previous('path') + "/") + this.previous('label');
          //Updates children       
          //TODO: we should not send so many updates to the server, mongodb must do a bunch update
          var children = this.get('children').models;
          for(index in children)
            children[index].save({'path': newFilter});
          //Triggers filter changed          
          this.trigger('filterChanged', newFilter, oldFilter)
        }          
      })
    },
    parse : function(resp, xhr) {
      //TODO: need to add the JSON parse to transform response string in obj. If not it does not work.
      return JSON.parse(resp);
    },
    getFilter: function(){
      return (this.get('path')===""?"":this.get('path') + "/") + this.get('label')
    },
    addChildren: function(children){
      this.get('children').add(children);
    }
  });
  return Tag;
});
