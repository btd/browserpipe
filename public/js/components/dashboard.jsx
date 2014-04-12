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
      <div className="dashboard" style={{width: (_state.selectedItem?"240px":"100%"), position: "absolute", right: 0 }}>
        <TopBarComponent
          selectedFolder={ this.state.selectedFolder }
          selectedItem={ this.state.selectedItem }
          isIframe= { this.props.isIframe } />
        <div className="dashboard-content">
          <div className="items clearfix">
            { this.renderFolders() }
            { this.renderItems() }
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
