/**
 * @jsx React.DOM
 */

var _state = require('../state'),
    _ = require('lodash'),
    $ = require('jquery'),
    React = require('react'),
    page = require('page');

var FolderComponent = React.createClass({    
  folderClicked: function() {
    page("/item/" + this.props.folder._id);
  },
  closeOptionClicked: function(e) {
    e.stopPropagation();
    _state.serverDeleteItem(this.props.folder);
  },
  editOptionClicked: function(e) {
    e.stopPropagation();
    this.refs.folderTitle.getDOMNode().className = "hide";
    this.refs.folderCloseOption.getDOMNode().className = "hide";
    this.refs.folderEditOption.getDOMNode().className = "hide";
    this.refs.folderTitleEditor.getDOMNode().className = "";
    this.refs.titleInput.getDOMNode().value = (this.props.folder.title? this.props.folder.title : '') ;
    this.refs.titleInput.getDOMNode().focus(); 
  },
  saveFolderTitle: function() {    
    var self = this;
    _state.serverUpdateItem({
      _id: this.props.folder._id,
      title: this.refs.titleInput.getDOMNode().value
    }, function() {
      self.hideInput();
    });
  },
  ifEnterSave: function(e) {
    if(e.keyCode === 13) this.saveFolderTitle();
  },
  hideInput: function() {
    this.refs.folderTitle.getDOMNode().className = "folder-title";
    this.refs.folderCloseOption.getDOMNode().className = "close-option fa fa-times";
    this.refs.folderEditOption.getDOMNode().className = "edit-option fa fa-pencil";
    this.refs.folderTitleEditor.getDOMNode().className = "hide";
  },
  renderTitleEditor: function() {
    return ( 
      <div className="title-editor" >
	<input ref="titleInput" type="text" defaultValue={this.props.folder.title} onKeyPress={this.ifEnterSave} />
	<button onClick={ this.saveFolderTitle } className="btn edit-title-save" type="button"><i className="fa fa-check"></i></button>
	<button onClick={ this.hideInput } className="btn edit-title-cancel" type="button"><i className="fa fa-times"></i></button>
      </div>
    );
  },
  renderItemScreenshots: function() {
    var self = this;
    return  this.props.container.items.map(function(tabId){
      var tab = _state.getItemById(tabId);
      return  <img className="tab-screenshot-small" src={ tab.screenshot } />
    })
  },
  render: function() {
    return (
      <div ref="folder" className="folder" onClick={ this.folderClicked } >
	<i ref="folderCloseOption" onClick={ this.closeOptionClicked } className="close-option fa fa-times"></i>
	<i ref="folderEditOption" onClick={ this.editOptionClicked } className="edit-option fa fa-pencil"></i>
        <div ref="folderTitle" className="folder-title">
	{ 
	  (this.props.folder.title && this.props.folder.title.trim() !='')?
	  this.props.folder.title : "New folder"
        }
	</div>
	<div ref="folderTitleEditor" className="hide" > 
	{ this.renderTitleEditor() }
	</div>
      </div>
    );
  }
});  

module.exports = FolderComponent 
