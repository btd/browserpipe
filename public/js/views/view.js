define([
  'jQuery',
  'underscore',
  'backbone'
], function($, _, Backbone, template){
  var AppView = Backbone.View.extend({
    postRender: null,
    initialize: function(options){       
      //console.time('Initializing View');
      this.initializeView(options);
      //console.timeEnd('Initializing View');      
    },
    renderView: function(){},
    render: function(){
      var _this = this;
      //console.time('Rendering View');
      this.renderView();
      //console.timeEnd('Rendering View');
      //Executes the postRender method once the browser gets control again and the element is attached
      if(this.postRender){
        setTimeout(function(){
          //console.time('Post Rendering View');
          _this.postRender();
          //console.timeEnd('Post Rendering View');
        }, 0);
      }
      return this;
    },
    //Use to extend events  
    addEvents: function(events) {
      this.delegateEvents( _.extend(_.clone(this.events ||  {}), events) );
    },  
    dispose: function() {
       // Unregister for event to stop memory leak
      
      //Backbone.View.prototype.dispose.apply(this, arguments);
      //TODO: check if views can be disposed like this
      _.invoke(this.views, 'dispose');      
      this.remove();
      this.off();
      Backbone.View.prototype.remove.call(this);
    }
  });
  return AppView;
});