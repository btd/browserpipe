define([
  'jQuery',
  'underscore',
  'backbone',
  'views/view',
  'views/items/container.item',
  'text!templates/containers/container.text'
], function($, _, Backbone, AppView, ContainerItem, template){
  var Container = AppView.extend({
    name: 'Container',
    tagName: 'div', 
    events: {
      "click" : "select"
    },
    attributes : function (){
      return {
        class : 'container',
        //TODO: This should have a real id 
        id : "container" + Math.random()
      }
    },    
    initializeView: function(){     
      this.container = this.options.container;
    },
    clean: function(){
      $(this.el).empty();
    },     
    renderView: function(){
      this
        .renderHeader()
        .renderItems();
      return this;   
    },   
    renderHeader: function(){
      var compiledTemplate = _.template( template, {container: this.container, icon: this.icon} );    
      $(this.el).html(compiledTemplate); 
      return this;
    },
    renderItems: function(){
      var $items = $('<ul class="items"></ul>');      
      for (index in this.container.items) {
          var bcv = new ContainerItem({item: this.container.items[index]});
          $items.append(bcv.render().el);
       };
      $('.box', this.el).append($items);  
      return this;
    },    
    postRender: function(){
      this.calculateHeight();
    },
    calculateHeight: function(){
      var headerHeight = $('.header', this.el).height();
      var wheight = $(window).height();
      var value = wheight - headerHeight - 95;
      $(".box", this.el).css("max-height", value);
    },
    getContainerName: function(){
      return this.container.name;
    },
    getContainerType: function(){
      return this.container.type;
    },
    select: function(){
      $(this.el).addClass("selected");
      this.trigger("selected", this.container);
    },
    unSelect: function(){
      $(this.el).removeClass("selected");
    }
  });
  return Container;
});