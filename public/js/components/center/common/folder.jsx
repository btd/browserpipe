/**
 * @jsx React.DOM
 */

var $ = require('jquery'),
    _state = require('../../state'),
    _ = require('lodash'),
    React = require('react'),
    selection = require('../../selection/selection');

var FolderComponent = React.createClass({   
  isSelected: function() {
    return selection.isFolderSelected(this.props.folder._id);
  },
  folderClicked: function(e) {    
    e.stopPropagation();
    if(e.ctrlKey){
      if(!this.isSelected())
          selection.selectFolder(this.props.folder._id);
      else
          selection.unSelectFolder(this.props.folder._id);
    }
    else   
      this.props.folderClicked(this.props.folder._id);
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
  getFolderClass: function() {
    return "folder " + (this.isSelected()? selection.getClassName() : '');
  },
  render: function() {
    return ( 
      <li ref="folder" 
        onMouseEnter={this.mouseEnter} 
        onMouseLeave={this.mouseLeave} 
        onClick={ this.folderClicked } 
        id={'folder_' + this.props.folder._id} 
        className={ this.getFolderClass() }
        draggable="true" 
        onDragStart={this.props.folderDraggable.objDragStart} 
        onDragEnd={this.props.folderDraggable.objDragEnd}
        onDragOver={this.props.folderDraggable.objDragOver}
        onDragEnter={this.props.folderDraggable.objDragEnter}
        onDragLeave={this.props.folderDraggable.objDragLeave}
        onDrop={this.props.folderDraggable.objDrop}
      >
        <span onClick={ this.folderClicked }>{ this.props.folder.label }</span>
        <i ref='btnRemoveChildFolder' onClick={this.removeFolder} className="icon-remove remove-child-folder hide" />
      </li>
    );
  }
});

module.exports = FolderComponent
