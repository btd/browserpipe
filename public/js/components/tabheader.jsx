/**
 * @jsx React.DOM
 */

var _state = require('../state'),
    util = require('../util'),
    React = require('react'),
    page = require('page'),
    UserOptionsComponent = require('./common/useroptions'),
    SelectFolderModalComponent = require('./modal/selectfolder'),
    browser = require('../browser/main');

var TabHeaderComponent = React.createClass({
  getInitialState: function() {
      return {
        selectedItem: this.props.selectedItem,
        sidebarCollapsed: this.props.sidebarCollapsed,
        viewScreenshot: this.props.viewScreenshot,
        url: this.props.url
      };
  },
  logoClicked: function() {
    page('/');
  },
  extendSidebarOptionClicked: function(e) {
    _state.sidebarCollapsed = false;
  },
  collapseSidebarOptionClicked: function(e) {
    _state.sidebarCollapsed = true;
  },
  updateInputUrl: function(e) {
    this.setState({ url: e.target.value });
  },
  ifEnterNavigate: function(e) {
    if(e.keyCode === 13) this.navigateEnteredURL(e);
  },
  navigateEnteredURL: function(e) {
    var url = e.target.value.trim();
    var parentId = _state.pending._id;
    browser.createAndOpen(
      parentId,
      url
    );
  },
  archiveTab: function() {
    SelectFolderModalComponent.render(this.state.selectedItem);
  },
  deleteOrRemoveTab: function() {
    if(this.state.selectedItem.deleted)
      _state.serverDeleteItem(this.state.selectedItem); //We fully delete the item
    else
      _state.serverUpdateItem({
        _id: this.state.selectedItem._id,
        deleted: true
      });
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
  renderToggleSidebar: function() {
    if(this.state.sidebarCollapsed)
      return <span className="extend-sidebar-option" onClick={ this.extendSidebarOptionClicked } >
               <span>menu</span><i className="fa fa-angle-double-right"></i>
             </span>
      else
        return <span className="collapse-sidebar-option" onClick={ this.collapseSidebarOptionClicked } >
                 <i className="fa fa-angle-double-left"></i><span>menu</span>
               </span>
  },
  renderTabInput: function() {
    return <div className="new-tab-input">
      <input type="text" placeholder="Enter an URL" id="small-url-input" value={this.state.url} onChange={this.updateInputUrl} onKeyPress={this.ifEnterNavigate} />
      <input type="button" id="small-url-btn" value="Go"  onClick={this.navigateEnteredURL} />
    </div>
  },
  renderLabels: function() {
    return <span className="labels">
      <span className="message">Snapshot of <a target="_blank" href={this.state.selectedItem.url} title={this.state.selectedItem.url}>page</a>{" from " + this.renderDate(this.state.selectedItem.createdAt) + "  "}</span>
      <span className={"label" + (this.isInArchive()?' hide':'')} title="click to select folder">
        <a href="#" onClick={ this.archiveTab }>
        { this.state.selectedItem.deleted? "click to restore" : "click to archive" }
        </a>
      </span>
      <span className={"label label-warning" + (this.isInArchive()?'':' hide')} onClick={ this.showItemInArchiveTab } title={"click to open archived folder"}>view folder</span>
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
        <span className="logo" onClick={ this.logoClicked }><img src={"<%= url('img/logo/logo-small.png') %>"} alt="Browserpipe logo small"/></span>
        { this.renderToggleSidebar() }
        { this.renderTabInput() }
        { this.renderLabels() }
        <UserOptionsComponent viewScreenshot={ this.state.viewScreenshot } />
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
    viewScreenshot,
    url
  ) {
  return React.renderComponent(
    <TabHeaderComponent
      selectedItem={selectedItem}
      sidebarCollapsed={sidebarCollapsed}
      viewScreenshot={viewScreenshot} 
      url={url} />,
    document.getElementById('tab-header')
  );
};
