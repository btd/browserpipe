define([
  'jQuery',
  'underscore',
  'backbone',
  'views/view',
  'views/containers/header',
  'views/items/container.item'
], function($, _, Backbone, AppView, ContainerHeader, ContainerItem){
  var Container = AppView.extend({
    name: 'Container',
    tagName: 'div', 
    events: {
      "click" : "select",
      "mouseenter" : "showOptionsToggle",
      "mouseleave" : "hideOptionsToggle"
    },
    menuOptions: [
      {name: "menu_option_close", label: "Close", method: "closeContainer"}
    ],
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
    addMenuOptions: function(menuOptions) {
      this.menuOptions = _.union(this.menuOptions, menuOptions);
    },  
    clean: function(){
      $(this.el).empty();
    },     
    renderView: function(){
      this
        .renderHeader()
        .renderBox()
        .renderItems();
      return this;   
    },   
    renderHeader: function(){        
      this.containerHeader = new ContainerHeader({container: this.container, icon: this.icon, menuOptions: this.menuOptions});               
      //Load the menu options events
      var menuEvents = {}
      for (var i = 0, l = this.menuOptions.length; i < l; i++) {         
        var menuOption = this.menuOptions[i];
        menuEvents['click .' + menuOption.name] = menuOption.method;
        //Add method to header to that triggers the event
        this.addMethodToContainerHeader(menuOption.method);
        //Listen to menu item event from header
        this.listenEventFromHeader(menuOption.method);
      }      
      //Add menu items events to header
      this.containerHeader.addEvents(menuEvents);
      //Render header
      $(this.el).append(this.containerHeader.render().el); 
      return this;
    },
    addMethodToContainerHeader: function(method){
      var self = this;
      this.containerHeader[method] = function(e){this.trigger(method, {self: self, e: e})}
    },
    listenEventFromHeader: function(method){
      this.containerHeader.on(method, this[method]);
    },
    renderBox: function(){
      $(this.el).append('<div class="box"></div>'); 
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
    },
    showOptionsToggle: function(){
      this.containerHeader.showOptionsToggle();
    },
    hideOptionsToggle: function(){
      this.containerHeader.hideOptionsToggle();
    },
    closeContainer: function(options){
      var self = options.self;
      self.trigger('containerClosed', self);
      self.close();       
    }
  });
  return Container;
});