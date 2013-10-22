/**
 * @jsx React.DOM
 */

var $ = require('jquery'),
    _state = require('../../state'),
    _ = require('lodash'),
    React = require('react');

var FolderComponent = React.createClass({   
  navigateToFolder: function(e) {    
    e.stopPropagation();
    this.props.navigateToChildFolder(this.refs.folder.getDOMNode().id.substring(7));
  },
  mouseEnter: function() {
    this.refs.btnRemoveChildFolder.getDOMNode().className = "icon-remove remove-child-folder";   
  },  
  mouseLeave: function() {
    this.refs.btnRemoveChildFolder.getDOMNode().className = "icon-remove remove-child-folder hide";   
  }, 
  removeFolder: function(e) {
    e.stopPropagation();
    _state.serverRemoveFolder(this.props.folder);
  },
  render: function() {
    return ( 
      <li ref="folder" onMouseEnter={this.mouseEnter} onMouseLeave={this.mouseLeave} onClick={ this.navigateToFolder } id={'folder_' + this.props.folder._id} className="folder">
        <span onClick={ this.navigateToFolder }>{ this.props.folder.label }</span>
        <i ref='btnRemoveChildFolder' onClick={this.removeFolder} className="icon-remove remove-child-folder hide" />
      </li>
    );
  }
});

module.exports = FolderComponent
