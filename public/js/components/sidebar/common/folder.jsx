/**
 * @jsx React.DOM
 */

var _state = require('../../../state'),
    $ = require('jquery'),
    React = require('react');

var FolderComponent = React.createClass({
  folderClicked: function() {
    if(this.props.navigateToFolder)
      this.props.navigateToFolder(this.props.folder);
  },
  removeOptionClicked: function(e) {
    e.stopPropagation();
    _state.removeItemFromArchive(this.props.folder);
  },
  editOptionClicked: function(e) {
    e.stopPropagation();
    this.refs.folderInner.getDOMNode().className = "hide";
    this.refs.folderOptions.getDOMNode().className = "hide";
    this.refs.folderTitleEditor.getDOMNode().className = "";
    this.refs.titleInput.getDOMNode().value = (this.props.folder.title? this.props.folder.title : '') ;
    this.refs.titleInput.getDOMNode().focus();
  },
  saveFolderTitle: function(e) {
    e.stopPropagation();
    var self = this;
    _state.serverUpdateItem({
      _id: this.props.folder._id,
      title: this.refs.titleInput.getDOMNode().value
    }, function() {
      self.hideInput();
    });
  },
  ifEnterSave: function(e) {
    if(e.keyCode === 13) this.saveFolderTitle(e);
  },
  cancelTitleEdit: function(e) {
    e.stopPropagation();
    this.hideInput();
  },
  hideInput: function() {
    this.refs.folderInner.getDOMNode().className = "";
    this.refs.folderOptions.getDOMNode().className = "folder-options";
    this.refs.folderTitleEditor.getDOMNode().className = "hide";
  },
  inputClicked: function(e) {
    e.stopPropagation();
  },
  renderTitleEditor: function() {
    return (
      <div className="title-editor" >
        <input ref="titleInput" type="text" defaultValue={this.props.folder.title} onKeyPress={this.ifEnterSave} onClick={this.inputClicked} />
        <button onClick={ this.saveFolderTitle } className="btn edit-title-save" type="button"><i className="fa fa-check"></i></button>
        <button onClick={ this.cancelTitleEdit } className="btn edit-title-cancel" type="button"><i className="fa fa-times"></i></button>
      </div>
    );
  },
  renderItemTitle: function() {
    return <div ref="folderTitle" className="folder-title">{ this.props.folder.title? this.props.folder.title : "New folder" } </div>
  },
  render: function() {
    return (
      <div ref="folder" className="folder" onClick={ this.folderClicked } >
        <div ref="folderInner" >
        { this.renderItemTitle() }
        </div>
        <div ref="folderTitleEditor" className="hide" >
        { this.renderTitleEditor() }
        </div>
        <ul ref="folderOptions" className="folder-options" onClick={ function(e){ e.stopPropagation(); } }>
          <li className="dropdown dropup nav-option">
            <a draggable="false"  href="#" data-toggle="dropdown" className="dropdown-toggle">
              <i className="fa fa-chevron-down"></i>
            </a>
            <ul className="dropdown-menu">
              <li >
                <a draggable="false" tabIndex="-1" href="#" onClick={ this.editOptionClicked }>
                  <span>Edit</span>
                </a>
              </li>
              <li className="divider"></li>
              <li>
                <a draggable="false" tabIndex="-1" href="#" onClick={ this.removeOptionClicked }>
                  <span>Remove</span>
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    );
  }
});

module.exports = FolderComponent
