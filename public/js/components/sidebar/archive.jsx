/**
 * @jsx React.DOM
 */

var _state = require('../../state'),
    React = require('react'),
    $ = require('jquery'),
    Folder = require('../common/folder'),
    Tab= require('../common/tab');

var ArchiveComponent = React.createClass({
  selectFolder: function(folder) {
    if(this.props.selectFolderToArchive)
      this.props.selectFolderToArchive(folder)
    else
      _state.selectedFolder = folder;
  },
  folderUpClicked: function() {
    var folder =_state.getItemById(this.props.selectedFolder.parent);
    this.selectFolder(folder);
  },
  newFolderClicked: function() {
    _state.serverAddItem(this.props.selectedFolder._id, { type: 2 });
  },
  navigateToFolder: function(folder) {
    this.selectFolder(folder);
  },
  breadcrumbItemClicked: function(e) {
    e.preventDefault();
    var id = $(e.target).data('bpipe-item-id');
    if(!id) //Is root folder because home icon clicked
      this.selectFolder(_state.archive);
    else
      this.selectFolder(_state.getItemById(id));
  },
  removeTab: function(tab) {
    _state.serverUpdateItem({
      _id: tab._id,
      deleted: true
    });
  },
  renderBreadcrumb: function() {
    var breadcrumbItems = [];
    var last = true;
    var folder = this.props.selectedFolder;
    while(folder) {
      breadcrumbItems.unshift(this.renderBreadcrumbItem(folder, last));
      folder = folder.parent? _state.getItemById(folder.parent) : null;
      last = false;
    }
    return  <ol className="breadcrumb">{ breadcrumbItems }</ol>
  },
  renderBreadcrumbItem: function(item, last) {
    var title = item._id !== _state.archive._id? (item.title? item.title : 'New Folder') : <i className="fa fa-home"></i>;
    return <li className={ last? 'active' : ''} >
             { last? title : <a data-bpipe-item-id={ item._id } href="#" onClick={ this.breadcrumbItemClicked }>{ title }</a> }
             <span className="divider">/</span>
           </li>
  },
  renderFolders: function() {
    var self = this;
    return this.props.selectedFolder.items.filter(function(itemId){
      var item = _state.getItemById(itemId);
      return item.isFolder();
    }).map(function(folderId){
      var folder = _state.getItemById(folderId);
      return  <Folder folder={ folder } navigateToFolder={ self.navigateToFolder } />
    })
  },
  renderItems: function() {
    var self = this;
    return this.props.selectedFolder.items.filter(function(itemId){
      var item = _state.getItemById(itemId);
      return !item.isFolder();
    }).map(function(itemId) {
      var tab = _state.getItemById(itemId);
      return  <Tab
        tab={ tab }
        selectedItem={ self.props.selectedItem }
        removeTab= { self.removeTab }
        showDropdown={ true }
        viewScreenshot={ self.props.viewScreenshot } />
    })
  },
  render: function() {
    return (
      <div className="archive">
        <div className="items">
          { this.renderBreadcrumb() }
          <div className="clearfix">
            <div className={"folder folder-up" + (this.props.selectedFolder._id === _state.archive._id?' hide':'')} title="Go one folder up" onClick={ this.folderUpClicked }>...</div>
            { this.renderFolders() }
            <div className="new-folder" title="Add new folder" onClick={ this.newFolderClicked }>Add folder</div>
          </div>
          { this.props.selectFolderToArchive? null: //If used to archive, we do not show items
              <div className="clearfix">
                { this.renderItems() }
             </div>
          }
        </div>
      </div>
    );
  }
});


module.exports = ArchiveComponent
