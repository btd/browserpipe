/**
 * @jsx React.DOM
 */

var _state = require('../state'),
    React = require('react'),
    page = require('page'),
    browser = require('../browser/main');

var TabHeaderComponent = React.createClass({
  getInitialState: function() {
      return {
          selectedItem: this.props.selectedItem
      };
  },
  showItemInBrowserTab: function() {
    _state.sidebarTab = "browser";
  },
  showItemInArchiveTab: function() {
    _state.selectedFolder = _state.getItemById(this.state.selectedItem.archiveParent);
    _state.sidebarTab = "archive";
  },
  showItemInRecentTab: function() {
    _state.sidebarTab = "recent";
  },
  viewInBrowser: function(e) {
    e.preventDefault();
    _state.moveItemToBrowser(this.state.selectedItem._id, false, false, function() {
      _state.sidebarTab = "browser";
    });
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
  renderDate: function(date) {
    var d = new Date(date);
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
  },
  render: function() {
    return (
      <div>
        <span className="labels">
          <span className={"label label-info" + (this.state.selectedItem.browserParent?'':' hide')} onClick={ this.showItemInBrowserTab }>browser</span>
          <span className={"label label-success" + (this.state.selectedItem.archiveParent?'':' hide')} onClick={ this.showItemInArchiveTab }>archive</span>
          <span className={"label" + (this.state.selectedItem.browserParent || this.state.selectedItem.archiveParent?' hide':'')} onClick={ this.showItemInRecentTab }>history</span>
        <span className="message">Snapshot of <a target="_blank" href={this.state.selectedItem.url} title={this.state.selectedItem.url}>{ this.state.selectedItem.url.substr(0,40)+(this.state.selectedItem.url.length > 40?'...':'')}</a>{" as it appeared on " + this.renderDate(this.state.selectedItem.createdAt) + "  "}</span>
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
                  <i className="icon-none"><span>Edit</span></i>
                </a>
              </li>
              <li>
                <a draggable="false"  tabIndex="-1" href="#">
                  <i className="icon-none"><span>Comment</span></i>
                </a>
              </li>
              <li>
                <a draggable="false"  tabIndex="-1" href="#">
                  <i className="icon-none"><span>Share</span></i>
                </a>
              </li>
              <li className="divider"></li>
              <li>
                <a draggable="false"  tabIndex="-1" href="#" onClick={ this.viewInBrowser }>
                  <i className="icon-none"><span>View in browser</span></i>
                </a>
              </li>
              <li className="divider"></li>
              <li>
                <a draggable="false"  tabIndex="-1" href="#">
                  <i className="icon-none"><span>Information</span></i>
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    );
  }
});


module.exports.render = function (
    selectedItem
  ) {
  return React.renderComponent(
    <TabHeaderComponent
      selectedItem={selectedItem} />,
    document.getElementById('tab-header')
  );
};
