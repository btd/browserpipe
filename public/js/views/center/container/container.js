define([
  'jQuery',
  'underscore',
  'backbone',
  'config',
  'models/state',
  'views/view',
  'views/center/container/header/header',
  'text!templates/containers/menu.text'
], function($, _, Backbone, config, _state, AppView, ContainerHeader, menuTemplate){
  var Container = AppView.extend({
    tagName: 'div', 
    events: {
      "click" : "selectContainer",
      "mouseenter" : "showOptionsToggle",
      "mouseleave" : "hideOptionsToggle"
    },    
    menuOptions: [
      {name: "menu_option_close", label: "Close", method: "closeContainer"}
    ],
    attributes : function (){
      return {
        class : 'container',
        id : "cont_" + this.model.get('_id')
      }
    },    
    initializeView: function(options){        
      _state.dashboards.on('currentContainerChange', this.currentContainerChanged, this);
    },
    addMenuOptions: function(menuOptions) {
      this.menuOptions = _.union(this.menuOptions, menuOptions);
    },  
    clean: function(){
      $(this.el).empty();
    },     
    renderView: function(){
      this
        .renderMenuOptions()
        .renderHeader()        
        .renderBox();
      return this;   
    },   
    renderHeader: function(){        
      this.header = new ContainerHeader({model: this.model});                     
      $(this.el).append(this.header.render().el); 
      return this;
    },
    renderMenuOptions: function(){        
      var compiledTemplate = _.template(menuTemplate, {options: this.menuOptions});    
      //Render options
      $(this.el).html(compiledTemplate); 
      
      //Load the menu options events
      for (var i = 0, l = this.menuOptions.length; i < l; i++) {         
        var menuOption = this.menuOptions[i];
        this.events['click .' + menuOption.name] = menuOption.method;
      }      
      
      return this;
    },
    renderBox: function(){
      $(this.el).append('<div class="box"></div>'); 
      return this;
    },   
    postRender: function(){
      this.addEvents(this.events);            
      this.calculateHeight();
    },
    calculateHeight: function(){
      //Gets the page height
      var wheight = $(window).height();
      //Gets the container header height
      var headerHeight = $('.header', this.el).height();
      //Sets the max-height of the container content (not the header)
      var value = wheight - config.HEADER_HEIGHT - config.BOTTOM_HEIGHT - headerHeight - (config.CONTAINER_VERTICAL_MARGIN * 2);
      $(".box", this.el).css("max-height", value);
    },
    selectContainer: function(e){      
      //Sets the container as current
      _state.dashboards.setCurrentContainer(this.model.get('_id'));
    },
    markAsSelected: function(){      
      this.$el.addClass('selected');      
    },
    unMarkAsSelected: function(){
      this.$el.removeClass('selected'); 
    },    
    isSelected: function(){
      return this.$el.hasClass('selected');
    },
    currentContainerChanged: function(container){ 
      if(container)
        if(container.get('_id') === this.model.get('_id')){
          if(!this.isSelected())
            this.markAsSelected();
        }
        else
          this.unMarkAsSelected();
      else
        this.unMarkAsSelected();        
    },
    showOptionsToggle: function(){
      this.$('.options .dropdown-toggle').css('display', 'block');      
    },
    hideOptionsToggle: function(){
      this.$('.options').removeClass('open');
      this.$('.options .dropdown-toggle').css('display', 'none');      
    },
    closeContainer: function(e){
      e.stopPropagation();      
      _state.dashboards.getCurrentDashboard().removeContainer(this.model);
      //As this was the current container, we set the current to null
      _state.dashboards.setCurrentContainer(null);
    }
  });
  return Container;
});