/**
 * @jsx React.DOM
 */

var _state = require('../state'),
    util = require('../util'),
    React = require('react'),
    page = require('page'),
    UserOptions = require('./common/useroptions'),
    SidebarOption = require('./common/sidebaroption'),
    SelectFolderModalComponent = require('./modal/selectfolder'),
    Tab = require('./common/tab');

var TabHeaderComponent = React.createClass({
  getInitialState: function() {
      return {
        selectedItem: this.props.selectedItem,
        sidebarCollapsed: this.props.sidebarCollapsed,
        sidebarTab: this.props.sidebarTab,
        viewScreenshot: this.props.viewScreenshot,
        url: this.props.url
      };
  },
  logoClicked: function() {
    page('/');
  },
  archiveTab: function() {
    SelectFolderModalComponent.render(this.state.selectedItem);
  },
  deleteOrRemoveTab: function() {
    var redirectHome = function() { page('/') };
    if(this.state.selectedItem.deleted)
      _state.serverDeleteItem(this.state.selectedItem, redirectHome); //We fully delete the item
    else
      _state.serverUpdateItem({
        _id: this.state.selectedItem._id,
        deleted: true
      }, redirectHome);
  },
  showItemInArchiveTab: function() {
    _state.selectedFolder = _state.getItemById(this.state.selectedItem.parent);
    _state.sidebarTab = "archive";
    _state.sidebarCollapsed = false;
  },
  isInArchive: function() {
    var item = this.state.selectedItem;
    return util.isItemInArchive(item, _state);
  },
  renderDate: function(date) {
    var d = new Date(date);
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
  },
  renderTab: function() {
    return <Tab
           tab={ this.state.selectedItem }
           selectedItem={ this.state.selectedItem }
           hideDropdown={ true }
           viewScreenshot={ false } />
  },
  renderLabels: function() {
    return <span className="labels">
      <span className="message">
        Snapshot of
        <a target="_blank"
           href={this.state.selectedItem.url}
           title={this.state.selectedItem.url}>
          page
        </a>
        {" from " + this.renderDate(this.state.selectedItem.createdAt) + "  "}
      </span>
      <span className={"label" + (this.isInArchive()?' hide':'')} title="click to select folder">
        <a href="#" onClick={ this.archiveTab }>
        { this.state.selectedItem.deleted? "click to restore" : "click to archive" }
        </a>
      </span>
      <span className={"label label-warning" + (this.isInArchive()?'':' hide')}
            onClick={ this.showItemInArchiveTab }
            title={"click to open archived folder"}>
            view folder
      </span>
     { this.renderTabOptions() }
    </span>
  },
  renderTabOptions: function() {
    return <ul className="tab-options">
      <li className="dropdown nav-option">
        <a draggable="false"  href="#" data-toggle="dropdown" className="dropdown-toggle">
          <span className="label">more...</span>
        </a>
        <ul className="dropdown-menu">
          <li onClick={ this.archiveTab }>
            <a draggable="false"  tabIndex="-1" href="#">
              <span>{ this.state.selectedItem.deleted? "Restore" : (this.isInArchive()? "Move" : "Archive") }</span>
            </a>
          </li>
          <li className="disabled">
            <a draggable="false"  tabIndex="-1" href="#">
              <span>Edit</span>
            </a>
          </li>
          <li className="divider"></li>
          <li onClick={ this.deleteOrRemoveTab }>
            <a draggable="false"  tabIndex="-1" href="#">
              <span>{ this.state.selectedItem.deleted? "Delete forever" : "Remove" }</span>
            </a>
          </li>
        </ul>
      </li>
    </ul>
  },
  render: function() {
    return (
      <div>
        <SidebarOption
          sidebarCollapsed={ this.state.sidebarCollapsed } />
        { this.renderTab() }
        { this.renderLabels() }
        <UserOptions
          viewScreenshot={ this.state.viewScreenshot }
          sidebarCollapsed={ this.state.sidebarCollapsed }
          sidebarTab={this.state.sidebarTab} />
        <span className="go-home" onClick={ this.logoClicked }>back home</span>
      </div>
    );
  },
  updateMargins: function() {
    if(this.state.sidebarCollapsed) $('#tab-section').removeClass('with-sidebar');
    else $('#tab-section').addClass('with-sidebar');
  },
  componentDidMount: function() { this.updateMargins(); },
  componentDidUpdate: function() { this.updateMargins(); }
});


module.exports.render = function (
    selectedItem,
    sidebarCollapsed,
    sidebarTab,
    viewScreenshot,
    url
  ) {
  return React.renderComponent(
    <TabHeaderComponent
      selectedItem={selectedItem}
      sidebarCollapsed={sidebarCollapsed}
      sidebarTab={sidebarTab}
      viewScreenshot={viewScreenshot}
      url={url} />,
    document.getElementById('tab-header')
  );
};
