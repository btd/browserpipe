define([
  'jQuery',
  'underscore',
  'backbone',
  'views/view'
], function($, _, Backbone, AppView){
  var SearchBoxView = AppView.extend({
    name: 'SearchBoxView',
    el: $("#search-form"), 
    active: false,
    initializeView: function(){ 
    },     
    renderView: function(){
      return this;    
    },
    searchBtnClicked: function(){           
      this.executeSearch($('#search-box', this.el).val())
      //Triggers the event that a search btn is clicked
      this.trigger('SearchBtnClicked');
    },
    executeSearch: function(query){
      console.time('Searching for "' + query + '"');
      this.active = true;      
      console.timeEnd('Searching for "' + query + '"'); 
    },
    postRender: function(){
      var _this = this;
      $('#search-btn', this.el).click(function(){_this.searchBtnClicked()});     
    }
  });
  return SearchBoxView;
});