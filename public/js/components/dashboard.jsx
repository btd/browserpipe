/**
 * @jsx React.DOM
 */

var _state = require('../state'),
    React = require('react'),
    page = require('page'),
    TopBarComponent = require('./topbar'),
    Folder = require('./folder'),
    Tab= require('./tab');

var DashboardComponent = React.createClass({
  getInitialState: function() {
      return {
          selectedFolder: this.props.selectedFolder,
          selectedItem: this.props.selectedItem,
          viewScreenshot: false, //TODO: save option in user
          addedByBookmarklet: false
      };
  },
  showScreenshots: function(value) {
    this.setState({ viewScreenshot: value });
  },
  addTabByBookmarklet: function() {
    window.parent.postMessage("save_" + this.state.selectedFolder._id, "*");
    this.setState({ addedByBookmarklet: true});
  },
  folderUpClicked: function() {
    if(this.state.selectedItem)
      _state.selectedFolder = _state.getItemById(this.state.selectedFolder.parent);
    else
      page("/item/" + this.state.selectedFolder.parent);
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
    var self = this;
    return this.state.selectedFolder.items.filter(function(itemId){
      var item = _state.getItemById(itemId);
      return item.type !== 2;
    }).map(function(itemId){
      var tab = _state.getItemById(itemId);
      return  <Tab tab={ tab } selectedItem={ self.state.selectedItem } viewScreenshot={ self.state.viewScreenshot } />
    })
  },
  renderAddOption: function() {
    if(!this.state.selectedItem && this.props.isIframe && !this.state.addedByBookmarklet) {
      return <div className="add-option" onClick={ this.addTabByBookmarklet }><span>Add here</span><i className="fa fa-level-up"></i></div>;
    }
  },
  render: function() {
    return (
      <div className="dashboard" style={{width: (this.state.selectedItem?"269px":"100%"), position: "absolute", right: 0 }}>
        <TopBarComponent
          selectedFolder={ this.state.selectedFolder }
          selectedItem={ this.state.selectedItem }
          showScreenshots={ this.showScreenshots }
          isIframe= { this.props.isIframe } />
        <div className="dashboard-content">
          <div className="items">
            <div className="clearfix">
              <div className={"folder folder-up" + (this.state.selectedFolder.parent?'':' hide')} title="Go one folder up" onClick={ this.folderUpClicked }>...</div>
              { this.renderFolders() }
            </div>
            <div className="clearfix">
              { this.renderItems() }
            </div>
          </div>
          { this.renderAddOption() }
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
