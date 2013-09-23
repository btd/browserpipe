/**
 * @jsx React.DOM
 */

var $ = require('jquery'),
    _state = require('models/state'),
    _ = require('lodash'),
    React = require('React');

var FolderView = React.createClass({   
  navigateToFolder: function(e) {    
    e.stopPropagation();
    this.props.navigateToChildFolder(this.refs.folder.getDOMNode().id.substring(7));
  },
  render: function() {
    return ( 
      <li ref="folder" onClick={ this.navigateToFolder } id={'folder_' + this.props.folder._id} class="folder">
        <span onClick={ this.navigateToFolder }>{ this.props.folder.label }</span>
        <i class="icon-remove remove-child-folder" />
      </li>
    );
  }
});

module.exports = FolderView
