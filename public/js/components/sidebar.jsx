/**
 * @jsx React.DOM
 */

var _state = require('../state'),
    React = require('react'),
    TopBarComponent = require('./sidebar/topsidebar'),
    BrowserComponent = require('./sidebar/browser'),
    ArchiveComponent = require('./sidebar/archive'),
    RecentComponent = require('./sidebar/recent'),
    BottomBarComponent = require('./sidebar/bottomsidebar');

var SidebarComponent = React.createClass({
  getInitialState: function() {
      return {
          items: this.props.items,
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
          return (<ArchiveComponent
            viewcreenshot={ this.state.viewScreenshot }
            selectedFolder={ this.state.selectedFolder }
            selectedItem={ this.state.selectedItem } />)
      case "recent":
          return (<RecentComponent
            viewcreenshot={ this.state.viewScreenshot }
            items={ this.state.items }
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
    items,
    selectedItem,
    selectedFolder,
    sidebarTab
  ) {
  return React.renderComponent(
    <SidebarComponent
      items={items}
      selectedItem={selectedItem}
      selectedFolder={selectedFolder}
      sidebarTab={sidebarTab} />,
    document.getElementById('sidebar-section')
  );
};
