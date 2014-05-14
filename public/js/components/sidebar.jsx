/**
 * @jsx React.DOM
 */

var _state = require('../state'),
    React = require('react'),
    TopBarComponent = require('./sidebar/topsidebar'),
    TrashComponent = require('./sidebar/trash'),
    ArchiveComponent = require('./sidebar/archive'),
    BottomBarComponent = require('./sidebar/bottomsidebar');

var SidebarComponent = React.createClass({
  getInitialState: function() {
      return {
          items: this.props.items,
          selectedItem: this.props.selectedItem,
          selectedFolder: this.props.selectedFolder,
          sidebarTab: this.props.sidebarTab,
          sidebarCollapsed: this.props.sidebarCollapsed,
          viewScreenshot: this.props.viewScreenshot
      };
  },
  renderSelectedTab: function() {
    switch(this.state.sidebarTab) {
      case "trash":
          return (<TrashComponent
            viewScreenshot={ this.state.viewScreenshot }
            items={ this.state.items }
            selectedItem={ this.state.selectedItem } />)
      default:
          return (<span>
            <ArchiveComponent
              viewScreenshot={ this.state.viewScreenshot }
              selectedItem={ this.state.selectedItem }
              selectedFolder={ this.state.selectedFolder} />
          </span>)
    }
  },
  render: function() {
    return (
      <div className={"sidebar" + (this.state.sidebarCollapsed? ' hide' : '')}>
        <TopBarComponent
          selectedTab={ this.state.sidebarTab } />
        <div className="sidebar-content">
          { this.renderSelectedTab() }
        </div>
        <BottomBarComponent
          selectedFolder={ this.state.selectedFolder } />
      </div>
    );
  }
});


module.exports.render = function (
    items,
    selectedItem,
    selectedFolder,
    sidebarTab,
    sidebarCollapsed,
    viewScreenshot
  ) {
  return React.renderComponent(
    <SidebarComponent
      items={items}
      selectedItem={selectedItem}
      selectedFolder={selectedFolder}
      sidebarTab={sidebarTab}
      sidebarCollapsed={sidebarCollapsed}
      viewScreenshot={viewScreenshot} />,
    document.getElementById('sidebar-section')
  );
};
