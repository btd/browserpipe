define([
  'jQuery',
  'underscore',
  'backbone'
], function($, _, Backbone, template){
  var AppView = Backbone.View.extend({
    name: 'No name',
    postRender: null,
    initialize: function(){ 
      console.time('Initializing View "' + this.name + '"');
      this.initializeView();
      console.timeEnd('Initializing View "' + this.name + '"');      
    },
    renderView: function(){},
    render: function(){
      var _this = this;
      console.time('Rendering View "' + this.name + '"');
      this.renderView();
      console.timeEnd('Rendering View "' + this.name + '"');
      //Executes the postRender method once the browser gets control again and the element is attached
      if(this.postRender){
        setTimeout(function(){
          console.time('Post Rendering View "' + _this.name + '"');
          _this.postRender();
          console.timeEnd('Post Rendering View "' + _this.name + '"');
        }, 0);
      }
      return this;
    },    
    close: function() {
        // Unregister for event to stop memory leak
        this.remove();
        this.off();
        Backbone.View.prototype.remove.call(this);
    }
  });
  return AppView;
});