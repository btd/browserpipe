/**
 * @jsx React.DOM
 */

var _state = require('../state'),
    _ = require('lodash'),
    React = require('react'),
    page = require('page'),
    Folder = require('./folder'),
    Tab= require('./tab');

var DashboardComponent = React.createClass({    
  getInitialState: function() {
      return {     
          selected: this.props.selected
      };
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
  folderUpClicked: function() {
    page("/item/" + this.state.selected.parent);
  },
  renderFolderUp: function() {
    if(this.state.selected && this.state.selected.type === 2 && this.state.selected._id !== _state.browser._id)
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
      return item.type !== 2 && item.visible;
    }).map(function(tabId){
      var tab = _state.getItemById(tabId);
      return  <Tab tab={ tab } />
    })
  },
  render: function() {
    var self = this;
    return (
      <div className="dashboard" >
	 <div className="items clearfix">
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
    );
  }
});


module.exports.render = function (
    selected
  ) {
  return React.renderComponent(
    <DashboardComponent 
      selected={selected} />,
    document.getElementById('dashboard-section')
  );
};
