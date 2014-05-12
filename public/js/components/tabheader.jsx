/**
 * @jsx React.DOM
 */

var _state = require('../state'),
    util = require('../util'),
    React = require('react'),
    page = require('page'),
    browser = require('../browser/main');

var TabHeaderComponent = React.createClass({
  getInitialState: function() {
      return {
        selectedItem: this.props.selectedItem,
        sidebarCollapsed: this.props.sidebarCollapsed
      };
  },
  extendSidebarOptionClicked: function(e) {
    _state.sidebarCollapsed = false;
  },
  collapseSidebarOptionClicked: function(e) {
    _state.sidebarCollapsed = true;
  },
  ifEnterNavigate: function(e) {
    if(e.keyCode === 13) this.navigateEnteredURL();
  },
  navigateEnteredURL: function() {
    var url = this.refs.urlInput.getDOMNode().value.trim();
    var parentId = _state.browser._id;
    browser.createAndOpenInBrowser(
      parentId,
      url,
      this.state.selectedItem._id,
      function(item) {
        util.scrollToItem(item);
      }
    );
  },
  backOptionClicked: function(e) {
    e.preventDefault();
    var previous = this.state.selectedItem.previous;
    if(previous)
      _state.moveItemToBrowser(previous, true, false, function() {
          page('/item/' + previous);
      });
  },
  forwardOptionClicked: function(e) {
    e.preventDefault();
    var next = this.state.selectedItem.next;
    if(next)
      _state.moveItemToBrowser(next, false, true, function() {
          page('/item/' + next);
      });
  },
  refreshOptionClicked: function() {
    browser.createAndOpenInBrowser(
      (this.state.selectedItem.browserParent? this.state.selectedItem.browserParent : _state.browser._id),
      this.state.selectedItem.url,
      this.state.selectedItem._id
    );
  },
  showItemInArchiveTab: function() {
    _state.selectedFolder = _state.getItemById(this.state.selectedItem.archiveParent);
    _state.sidebarTab = "archive";
  },
  openOptionClicked: function() {
    _state.moveItemToBrowser(this.state.selectedItem._id, false, false, function() {
      _state.sidebarTab = "browser";
      var msg = Messenger().post({
        message: "Tab opened",
        hideAfter: 6
      });
    });
  },
  isInBrowser: function() {
    var item = this.state.selectedItem;
    return util.isItemInBrowser(item, _state);
  },
  isInArchive: function() {
    var item = this.state.selectedItem;
    return util.isItemInArchive(item, _state);
  },
  renderDate: function(date) {
    var d = new Date(date);
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
  },
  render: function() {
    return (
      <div>
        { this.state.sidebarCollapsed ?
          (<span className="extend-sidebar-option" onClick={ this.extendSidebarOptionClicked } >
            <span>menu</span><i className="fa fa-angle-double-right"></i>
          </span>):
          (<span className="collapse-sidebar-option" onClick={ this.collapseSidebarOptionClicked } >
            <i className="fa fa-angle-double-left"></i><span>menu</span>
          </span>)
        }
        <div className="new-tab-input">
          <input type="text" placeholder="Enter an URL" id="small-url-input" ref="urlInput" defaultValue={ this.state.selectedItem.url } onKeyPress={this.ifEnterNavigate} />
          <input type="button" id="small-url-btn" value="Go"  onClick={this.navigateEnteredURL} />
        </div>
        <span className="labels">
          <span className="message">Snapshot of <a target="_blank" href={this.state.selectedItem.url} title={this.state.selectedItem.url}>page</a>{" from " + this.renderDate(this.state.selectedItem.createdAt) + "  "}</span>
          <span className={"label" + (this.isInBrowser()?' hide':'')} onClick={ this.openOptionClicked } title="click to open in browser">click to open</span>
          <span className={"label" + (this.isInArchive()?' hide':'')} title="click to select folder to archive"><a data-toggle="modal" href="#" data-target="#select-folder-modal">click to archive</a></span>
          <span className={"label label-warning" + (this.isInArchive()?'':' hide')} onClick={ this.showItemInArchiveTab } title={"click to open archived folder"}>archived</span>
        </span>
        <div className="refresh-option" onClick={ this.refreshOptionClicked } >
          <i className="fa fa-refresh"></i>
        </div>
        <div className="forward-option" onClick={ this.forwardOptionClicked } >
          <i className={"fa fa-arrow-circle-right" + (this.state.selectedItem.next? "" : " disabled")}></i>
        </div>
        <div className="back-option" onClick={ this.backOptionClicked } >
          <i className={"fa fa-arrow-circle-left" + (this.state.selectedItem.previous? "" : " disabled")}></i>
        </div>
        <ul className="tab-options">
          <li className="dropdown nav-option">
            <a draggable="false"  href="#" data-toggle="dropdown" className="dropdown-toggle">
              <i className="fa fa-gear"></i>
            </a>
            <ul className="dropdown-menu">
              <li>
                <a draggable="false"  tabIndex="-1" href="#">
                  <span>Edit</span>
                </a>
              </li>
              <li>
                <a draggable="false"  tabIndex="-1" href="#">
                  <span>Comment</span>
                </a>
              </li>
              <li>
                <a draggable="false"  tabIndex="-1" href="#">
                  <span>Share</span>
                </a>
              </li>
              <li className="divider"></li>
              <li>
                <a draggable="false"  tabIndex="-1" href="#">
                  <span>Information</span>
                </a>
              </li>
              <li className="divider"></li>
              <li>
                <a draggable="false"  tabIndex="-1" href="#">
                  <span>Delete</span>
                </a>
              </li>
            </ul>
          </li>
        </ul>
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
    sidebarCollapsed
  ) {
  return React.renderComponent(
    <TabHeaderComponent
      selectedItem={selectedItem}
      sidebarCollapsed={sidebarCollapsed} />,
    document.getElementById('tab-header')
  );
};
