/**
 * @jsx React.DOM
 */

var $ = require('jquery'),
    _state = require('../../state'),
    _ = require('lodash'),
    React = require('react');

var FolderComponent = React.createClass({   
  folderClicked: function(e) {    
    e.stopPropagation();        
    e.stopPropagation();
    if(e.ctrlKey){      
      var added = _state.addOrRemoveSelectedFolder(this.props.folder._id);
      var $el = $(this.refs.folder.getDOMNode());
      if(added)
        $el.addClass('selection-selected');
      else
        $el.removeClass('selection-selected');
    }
    else   
      this.props.navigateToChildFolder(this.props.folder._id);
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
      <li ref="folder" onMouseEnter={this.mouseEnter} onMouseLeave={this.mouseLeave} onClick={ this.folderClicked } id={'folder_' + this.props.folder._id} className="folder">
        <span onClick={ this.folderClicked }>{ this.props.folder.label }</span>
        <i ref='btnRemoveChildFolder' onClick={this.removeFolder} className="icon-remove remove-child-folder hide" />
      </li>
    );
  }
});

module.exports = FolderComponent
