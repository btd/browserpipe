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
  render: function() {
    return (
      <div ref="folder" className={"folder" + (this.props.browserMode? " hide" : "")} onClick={ this.folderClicked } >
        <div className="folder-title">{ this.props.folder.title }</div>
      </div>
    );
  }
});  

module.exports = FolderComponent 
