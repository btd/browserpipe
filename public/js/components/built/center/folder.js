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
  render: function() {
    return ( 
      React.DOM.li( {ref:"folder", onClick: this.navigateToFolder,  id:'folder_' + this.props.folder._id, className:"folder"}, 
        React.DOM.span( {onClick: this.navigateToFolder },  this.props.folder.label ),
        React.DOM.i( {className:"icon-remove remove-child-folder"} )
      )
    );
  }
});

module.exports = FolderView
