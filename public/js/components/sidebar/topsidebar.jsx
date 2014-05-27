/**
 * @jsx React.DOM
 */

var React = require('react'),
    _state = require('../../state'),
    page = require('page');

var TopSideBarComponent = React.createClass({
  closeSidebar: function(e) {
    _state.sidebarCollapsed = true;
  },
  changeSelectedTab: function(value) {
    return function() { _state.sidebarTab = value; };
  },
  render: function() {
    return (
      <div className="top-sidebar">
        <span className="close-sidebar" onClick={ this.closeSidebar }>
          <i className="fa fa-bars"></i>
        </span>
        <ul className="nav nav-tabs">
          <li className={this.props.selectedTab === "archive"? "active" : ""} onClick={ this.changeSelectedTab('archive') } >
            <a href="#">Archive</a>
          </li>
          <li className={ "recent" + (this.props.selectedTab === "trash"? " active" : "")} onClick={ this.changeSelectedTab('trash') }>
            <a href="#"><i className="fa fa-trash-o"></i></a>
          </li>
        </ul>
      </div>
    );
  }
});

module.exports = TopSideBarComponent
