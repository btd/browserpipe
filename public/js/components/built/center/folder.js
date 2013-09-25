/**
 * @jsx React.DOM
 */

var $ = require('jquery'),
    _state = require('models/state'),
    _ = require('lodash'),
    React = require('React');

var FolderView = React.createClass({displayName: 'FolderView',   
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
      React.DOM.li( {ref:"folder", onMouseEnter:this.mouseEnter, onMouseLeave:this.mouseLeave, onClick: this.navigateToFolder,  id:'folder_' + this.props.folder._id, className:"folder"}, 
        React.DOM.span( {onClick: this.navigateToFolder },  this.props.folder.label ),
        React.DOM.i( {ref:"btnRemoveChildFolder", onClick:this.removeFolder, className:"icon-remove remove-child-folder hide"} )
      )
    );
  }
});

module.exports = FolderView
