/**
 * @jsx React.DOM
 */

var $ = require('jquery'),
    _state = require('../../../state'),
    _ = require('lodash'),
    React = require('react'),
    PanelActivatorMixin = require('../../util/panel.activator.mixin');

var FolderComponent = React.createClass({ 
  mixins: [PanelActivatorMixin],    
  folderClicked: function(e) {    
    e.stopPropagation();
    this.props.folderClicked(this.props.folder._id);      
  },
  render: function() {
    return ( 
      <li ref="folder" 
        onMouseEnter={this.mouseEnter} 
        onMouseLeave={this.mouseLeave} 
        onClick={ this.handlePanelClick(this.folderClicked) } 
        id={'folder_' + this.props.folder._id} 
        className='folder'
        draggable="true" 
      >
        <span onClick={ this.handlePanelClick(this.folderClicked) }>{ this.props.folder.label }</span>        
      </li>
    );
  }
});

module.exports = FolderComponent
