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
  newFolderClicked: function() {
    _state.serverAddItemToItem(this.state.selected._id, { type: 2 });
  },
  deleteActiveContainer: function(e) {
    e.preventDefault();
    e.stopPropagation();
    _state.serverDeleteItem(this.state.selected, function(){
      page('/');
    });
  },
  folderUpClicked: function() {
    page("/item/" + this.state.selected.parent);
  },
  renderFolderUp: function() {
    if(this.state.selected && this.state.selected.type === 2 && this.state.selected.parent !== _state.browser._id)
      return (
	<div className="folder" onClick={ this.folderUpClicked } >
	  <div className="folder-title up">...</div>
	</div>
      );
    else return null;
  },
  renderFolders: function() {
    if(!this.state.selected) return null;
    else return this.state.selected.items.filter(function(itemId){
      var item = _state.getItemById(itemId);
      return item.type === 2;
    }).map(function(folderId){
      var folder = _state.getItemById(folderId);
      return  <Folder folder={ folder } />
    })
  },
  renderItems: function(container) {
    if(!this.state.selected) return null;
    else return this.state.selected.items.filter(function(itemId){
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
	    <li className="dropdown nav-option">
	      <a draggable="false"  href="#" data-toggle="dropdown" className="dropdown-toggle">
	        <i className="fa fa-user"></i>
	      </a>
	      <ul className="dropdown-menu">
	        <li>
		  <a draggable="false"  tabindex="-1" href="/settings">
		    <i className="icon-none"><span>Settings</span></i>
		  </a>
		</li>
		<li>
		  <a draggable="false"  tabindex="-1" href="/help">
		    <i className="icon-none"> <span>Help</span></i>
		  </a>
		</li>
		<li className="divider"></li>
		<li>
		  <a draggable="false"  tabindex="-1" href="/logout">
		    <i className="icon-none"><span>Logout </span></i>
		  </a>
                </li>
	      </ul>
	    </li>
	  </div>
	  <div className="search-box">
	    <input type="text" placeholder="Find a tab"/>
	  </div>
	</div>
	<div className="containers">
	  {                   
	    this.state.browser.items.map(function(containerId) {
	      var container = _state.getItemById(containerId);
	      return <Container container={ container } selected={ self.state.selected } /> 
	    })
	  }  
	  <div className="new-container" title="Add new window" onClick={ this.newContainerClicked }><i className="fa fa-plus"></i></div>
	</div>
        <div className="container-options">
	    <li className="dropdown nav-option">
	      <a draggable="false"  href="#" data-toggle="dropdown" className="dropdown-toggle">
	        <i className="fa fa-cog"></i>
	      </a>
	      <ul className="dropdown-menu">
		<li>
		  <a draggable="false" tabindex="-1" href="#" onClick={ this.deleteActiveContainer } >
		    <i className="icon-none"><span>Delete</span></i>
		  </a>
                </li>
	      </ul>
	    </li>
	</div>
	<div className="container-items">
	 <div className="items">
	   { this.renderFolderUp() }
	   { this.renderFolders() }
	   { this.renderItems() }
	   <div className="new-options">
	     <div className="new-tab" title="Add new tab" onClick={ this.newTabClicked }>
	       <i className="fa fa-plus"></i>
	     </div>
	     <div className="new-folder" title="Add new folder" onClick={ this.newFolderClicked }>
	       <i className="fa fa-folder"></i>
	     </div>
	     <div className="new-note" title="Add new note" >
	       <i className="fa fa-file"></i>
	     </div>
	   </div>
	 </div>
	</div>
      </div>
    );
  }
});


module.exports.render = function (
    browser,
    selected
  ) {
  return React.renderComponent(
    <HomeComponent 
      browser={browser}
      selected={selected} />,
    document.getElementById('home-section')
  );
};
