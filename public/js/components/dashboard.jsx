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
          selectedItem: this.props.selectedItem,
          addedByBookmarklet: false
      };
  },
  moveTab: function() {
    _state.serverUpdateItem({
      _id: this.state.selectedItem._id,
      parent: this.state.selectedFolder._id
    }, function() {
      var msg = Messenger().post({
        message: "Tab moved",
        hideAfter: 6
      });
    });
  },
  addTabByBookmarklet: function() {
    window.parent.postMessage("save_" + this.state.selectedFolder._id, "*");
    this.setState({ addedByBookmarklet: true});
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
      return  <Tab tab={ tab } selectedItem={ self.state.selectedItem } />
    })
  },
  renderOptions: function() {
    if(this.state.selectedItem && this.state.selectedItem.parent !== this.state.selectedFolder._id) {
      return <div className="move-option" onClick={ this.moveTab }><i className="fa fa-level-up"></i><span>Move here</span></div>;
    }
    else if(!this.state.selectedItem && this.props.isIframe && !this.state.addedByBookmarklet) {
      return <div className="add-option" onClick={ this.addTabByBookmarklet }><i className="fa fa-level-up"></i><span>Add here</span></div>;
    }
  },
  render: function() {
    return (
      <div className="dashboard" style={{width: (this.state.selectedItem?"240px":"100%"), position: "absolute", right: 0 }}>
        <TopBarComponent
          selectedFolder={ this.state.selectedFolder }
          selectedItem={ this.state.selectedItem }
          isIframe= { this.props.isIframe } />
        <div className="dashboard-content">
          <div className="items clearfix">
            { this.renderFolders() }
            { this.renderItems() }
          </div>
          { this.renderOptions() }
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
