/**
 * @jsx React.DOM
 */

var _state = require('../../state'),
    React = require('react'),
    Folder = require('./common/folder'),
    Tab= require('./common/tab');

var FoldersComponent = React.createClass({
  folderUpClicked: function() {
    _state.selectedFolder = _state.getItemById(this.props.selectedFolder.archiveParent);
  },
  newFolderClicked: function() {
    _state.serverAddItemToArchive(this.props.selectedFolder._id, { type: 2 });
  },
  navigateToFolder: function(folder) {
    _state.selectedFolder = folder;
  },
  breadcrumbItemClicked: function(e) {
    e.preventDefault();
    var id = $(e.target).data('bpipe-item-id');
    _state.selectedFolder = _state.getItemById(id);
  },
  removeTab: function(tab) {
    _state.removeItemFromArchive(tab);
  },
  moveTab: function() {
    _state.serverUpdateItem({
      _id: this.props.selectedItem._id,
      parent: this.props.selectedFolder._id
    }, function() {
      var msg = Messenger().post({
        message: "Tab moved",
        hideAfter: 6
      });
    });
  },
  renderBreadcrumb: function() {
    var breadcrumbItems = [];
    var last = true;
    var folder = this.props.selectedFolder;
    while(folder) {
      breadcrumbItems.unshift(this.renderBreadcrumbItem(folder, last));
      folder = folder.archiveParent? _state.getItemById(folder.archiveParent) : null;
      last = false;
    }
    return  <div className="breadcrumb"><ol className="breadcrumb-inner">{ breadcrumbItems }</ol></div>
  },
  renderBreadcrumbItem: function(item, last) {
    var title = item._id !== _state.archive._id? (item.title? item.title : 'New Folder') : 'Home';
    return <li className={ last? 'active' : ''} >
             { last? title : <a data-bpipe-item-id={ item._id } href="#" onClick={ this.breadcrumbItemClicked }>{ title }</a> }
             { last? '' : <span className="divider">/</span> }
           </li>
  },
  renderMoveOption: function() {
    if(this.props.selectedItem && this.props.selectedItem.archiveParent !== this.props.selectedFolder._id)
      return <div className="move-to-folder" title="Move tab to this folder" onClick={ this.moveTab }>
        <i className="fa fa-caret-square-o-down"></i>
      </div>
  },
  renderFolders: function() {
    var self = this;
    return this.props.selectedFolder.items.filter(function(itemId){
      var item = _state.getItemById(itemId);
      return item.type === 2;
    }).map(function(folderId){
      var folder = _state.getItemById(folderId);
      return  <Folder folder={ folder } navigateToFolder={ self.navigateToFolder } />
    })
  },
  renderItems: function() {
    var self = this;
    return this.props.selectedFolder.items.filter(function(itemId){
      var item = _state.getItemById(itemId);
      return item.type !== 2;
    }).map(function(itemId){
      var tab = _state.getItemById(itemId);
      return  <Tab
        tab={ tab }
        selectedItem={ self.props.selectedItem }
        removeTab= { self.removeTab }
        viewScreenshot={ self.props.viewScreenshot } />
    })
  },
  render: function() {
    return (
      <div className="folders">
        <div className="options">
          { this.renderBreadcrumb() }
          { this.renderMoveOption() }
          <div className="new-folder" title="Add new folder" onClick={ this.newFolderClicked }>
            <i className="fa fa-folder"></i>
          </div>
        </div>
        <div className="items">
          <div className="clearfix">
            <div className={"folder folder-up" + (this.props.selectedFolder._id === _state.archive._id?' hide':'')} title="Go one folder up" onClick={ this.folderUpClicked }>...</div>
            { this.renderFolders() }
          </div>
          <div className="clearfix">
            { this.renderItems() }
          </div>
        </div>
      </div>
    );
  }
});


module.exports = FoldersComponent
