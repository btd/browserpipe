/**
 * @jsx React.DOM
 */

var $ = require('jquery'),
    _state = require('../../../state'),
    _ = require('lodash'),
    React = require('react'),
    PanelActivatorMixin = require('../../util/panel.activator.mixin'),
    selection = require('../../../selection/selection');

var FolderComponent = React.createClass({ 
  mixins: [PanelActivatorMixin],  
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
  getFolderClass: function() {
    return "folder " + (this.isSelected()? selection.getClassName() : '');
  },
  render: function() {
    return ( 
      <li ref="folder" 
        onMouseEnter={this.mouseEnter} 
        onMouseLeave={this.mouseLeave} 
        onClick={ this.handlePanelClick(this.folderClicked) } 
        id={'folder_' + this.props.folder._id} 
        className={ this.getFolderClass() }
        draggable="true" 
        /*onDragStart={this.props.folderDraggable.objDragStart} 
        onDragEnd={this.props.folderDraggable.objDragEnd}
        onDragOver={this.props.folderDraggable.objDragOver}
        onDragEnter={this.props.folderDraggable.objDragEnter}
        onDragLeave={this.props.folderDraggable.objDragLeave}
        onDrop={this.props.folderDraggable.objDrop}*/
      >
        <span onClick={ this.handlePanelClick(this.folderClicked) }>{ this.props.folder.label }</span>        
      </li>
    );
  }
});

module.exports = FolderComponent
