/**
 * @jsx React.DOM
 */

var _state = require('../state'),
    _ = require('lodash'),
    React = require('react'),
    page = require('page'),
    TopBarComponent = require('./topbar'),
    Folder = require('./folder'),
    Tab= require('./tab');

var DashboardComponent = React.createClass({
  getInitialState: function() {
      return {
          selectedFolder: this.props.selectedFolder,
          selectedItem: this.props.selectedItem
      };
  },
  /*newTabClicked: function() {
    _state.serverAddItemToItem(this.state.selected._id, { type: 0 }, function(item) {
      //TODO: navigation to the just added container is not working because websockets is taking more time to add it than ajax reponse.
      //We should fix this by sending crud request to server via websockets instead of ajax.
      setTimeout(function() { page('/item/' + item._id) }, 500);
    });
  },*/
  newFolderClicked: function() {
    _state.serverAddItemToItem(this.state.selectedFolder._id, { type: 2 });
  },
  folderUpClicked: function() {
    if(_state.selectedItem)
      _state.selectedFolder = _state.getItemById(this.state.selectedFolder.parent);
    else
      page("/item/" + this.state.selectedFolder.parent);
  },
  renderFolderUp: function() {
    if(this.state.selectedFolder._id !== _state.browser._id)
      return (
        <div className="folder" onClick={ this.folderUpClicked } >
          <div className="folder-title up">...</div>
        </div>
      );
    else return null;
  },
  renderFolders: function() {
    return this.state.selectedFolder.items.filter(function(itemId){
      var item = _state.getItemById(itemId);
      return item.type === 2;
    }).map(function(folderId){
      var folder = _state.getItemById(folderId);
      return  <Folder folder={ folder } />
    })
  },
  renderItems: function() {
    return this.state.selectedFolder.items.filter(function(itemId){
      var item = _state.getItemById(itemId);
      return item.type !== 2;
    }).map(function(itemId){
      var tab = _state.getItemById(itemId);
      return  <Tab tab={ tab } />
    })
  },
  render: function() {
    return (
      <div className="dashboard" style={{width: (_state.selectedItem?"240px":"100%"), position: "absolute", right: 0, height: "100%" }}>
        <TopBarComponent 
          selectedFolder={ this.state.selectedFolder } 
          selectedItem={ this.state.selectedItem } 
          isIframe= { this.props.isIframe } />
        <div className="items clearfix">
          { this.renderFolderUp() }
          { this.renderFolders() }
          { this.renderItems() }
          <div className="new-options">
            <div className="new-tab" title="Add new tab" onClick={ this.newTabClicked }>
              <i className="fa fa-plus"></i>
            </div>
            <div className="new-folder" title="Add new folder" onClick={ this.newFolderClicked }>
              <i className="fa fa-folder"></i>
            </div>
            <div className="new-note" title="Add new note" >
              <i className="fa fa-file"></i>
            </div>
          </div>
        </div>
      </div>
    );
  }
});


module.exports.render = function (
    isIframe,
    selectedFolder,
    selectedItem
  ) {
  return React.renderComponent(
    <DashboardComponent
      isIframe={isIframe}
      selectedFolder={selectedFolder} 
      selectedItem={selectedItem} />,
    document.getElementById('dashboard-section')
  );
};
