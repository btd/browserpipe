/**
 * @jsx React.DOM
 */

var _state = require('../state'),
    React = require('react'),
    TopBarComponent = require('./sidebar/topsidebar'),
    BrowserComponent = require('./sidebar/browser'),
    FoldersComponent = require('./sidebar/folders'),
    TrashComponent = require('./sidebar/trash'),
    BottomBarComponent = require('./sidebar/bottomsidebar');

var SidebarComponent = React.createClass({
  getInitialState: function() {
      return {
          selectedItem: this.props.selectedItem,
          selectedFolder: this.props.selectedFolder,
          sidebarTab: this.props.sidebarTab,
          viewScreenshot: false //TODO: save option in user
      };
  },
  showScreenshots: function(value) {
    this.setState({ viewScreenshot: value });
  },
  renderSelectedTab: function() {
    switch(this.state.sidebarTab) {
      case "archive":
          return (<FoldersComponent
            viewcreenshot={ this.state.viewScreenshot }
            selectedFolder={ this.state.selectedFolder }
            selectedItem={ this.state.selectedItem } />)
      case "trash":
          return (<TrashComponent
            viewcreenshot={ this.state.viewScreenshot }
            selectedItem={ this.state.selectedItem } />)
      default:
          return (<BrowserComponent
            viewcreenshot={ this.state.viewScreenshot }
            selectedItem={ this.state.selectedItem } />)
    }
  },
  render: function() {
    return (
      <div className="sidebar">
        <TopBarComponent
          selectedTab={ this.state.sidebarTab } />
        <div className="sidebar-content">
          { this.renderSelectedTab() }
        </div>
        <BottomBarComponent
          showScreenshots={ this.showScreenshots } />
      </div>
    );
  }
});


module.exports.render = function (
    selectedItem,
    selectedFolder,
    sidebarTab
  ) {
  return React.renderComponent(
    <SidebarComponent
      selectedItem={selectedItem}
      selectedFolder={selectedFolder}
      sidebarTab={sidebarTab} />,
    document.getElementById('sidebar-section')
  );
};
