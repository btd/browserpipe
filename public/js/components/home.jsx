/**
 * @jsx React.DOM
 */

var _state = require('../state'),
    _ = require('lodash'),
    React = require('react'),
    page = require('page'),
    Container= require('./container'),
    Folder = require('./folder'),
    Tab= require('./tab');

var HomeComponent = React.createClass({    
  getInitialState: function() {
      return {     
          archive: this.props.archive,
          browser: this.props.browser,
          selected: this.props.selected,
      };
  },
  newContainerClicked: function() {
    _state.serverAddItemToItem(this.state.browser._id, { type: 2 }, function(item) {
      //TODO: navigation to the just added container is not working because websockets is taking more time to add it than ajax reponse.
      //We should fix this by sending crud request to server via websockets instead of ajax.
      setTimeout(function() {  page('/item/' + item._id) }, 500); 
    });
  },
  newTabClicked: function() {
    _state.serverAddItemToItem(this.state.selected._id, { type: 0 }, function(item) {
      //TODO: navigation to the just added container is not working because websockets is taking more time to add it than ajax reponse.
      //We should fix this by sending crud request to server via websockets instead of ajax.
      setTimeout(function() { page('/item/' + item._id) }, 500); 
    });
  },
  archiveClicked: function() { 
    page('/item/' + this.state.archive._id);
  },
  isContainerActive: function(container) {
    return this.state.selected && (
	(this.state.selected._id === container._id) ||
        (_.contains(container.items, this.state.selected._id))
    );
  },
  renderFolders: function(container) {
    return container.items.filter(function(itemId){
      var item = _state.getItemById(itemId);
      return item.type === 2;
    }).map(function(folderId){
      var folder = _state.getItemById(folderId);
      return  <Folder folder={ folder } />
    })
  },
  renderItems: function(container) {
    var self = this;
    return  container.items.filter(function(itemId){
      var item = _state.getItemById(itemId);
      return item.type !== 2;
    }).map(function(tabId){
      var tab = _state.getItemById(tabId);
      return  <Tab tab={ tab } />
    })
  },
  render: function() {
    var self = this;
    return (
      <div className="home" >
	<div className="home-top">
	  <div className="logo">Listboard.it</div>
	  <div className="user-options">
	    <i className="icon-user"></i>
	  </div>
	  <div className="search-box">
	    <input type="text" placeholder="Find a tab"/>
	  </div>
	</div>
      
	<div className="containers">
	  {                   
	    this.state.browser.items.map(function(containerId) {
	      var container = _state.getItemById(containerId);
	      return <Container container={ container } active={ self.state.selected && self.state.selected._id == container._id } /> 
	    })
	  }  
	  <div className="container archive" onClick={ this.archiveClicked } >
	    <div>Archive</div>
	  </div>
	  <div className="new-container" onClick={ this.newContainerClicked }><i className="icon-plus"></i></div>
	</div>
	
	<div className="container-items">
	  {
	    this.state.browser.items.map(function(containerId) {
	      var container = _state.getItemById(containerId);
	      return <div className={"items" + (self.isContainerActive(container)? " active": "")}>
		       { self.renderItems(container) }
		       <div className="new-tab" onClick={ self.newTabClicked }>
			 <i className="icon-plus"></i>
		       </div>
		     </div>
	    })
	  }
	  <div className={"items" + (this.isContainerActive(this.state.archive)? " active": "")}>
	    { this.renderFolders(this.state.archive) }
	    { this.renderItems(this.state.archive) }
	    <div className="new-tab" onClick={ self.newTabClicked }>
	      <i className="icon-plus"></i>
	    </div>
	  </div>
	</div>
      </div>
    );
  }
});


module.exports.render = function (
    archive,
    browser,
    selected
  ) {
  return React.renderComponent(
    <HomeComponent 
      archive={archive}
      browser={browser}
      selected={selected} />,
    document.getElementById('home-section')
  );
};
