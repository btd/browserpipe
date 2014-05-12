/**
 * @jsx React.DOM
 */

var React = require('react'),
    _state = require('../../state'),
    page = require('page');

var TopSideBarComponent = React.createClass({
  newTabClicked: function() {
    page('/new');
  },
  changeSelectedTab: function(value) {
    return function() { _state.sidebarTab = value; };
  },
  render: function() {
    return (
      <div className="top-sidebar">
        <div className="commands">
          <span className="logo"><img src={"<%= url('img/logo/logo-small.png') %>"} alt="Browserpipe logo small"/></span>
          <div className="search-options input-append">
            <input type="text" placeholder="Search a tab" className="search-input" ref="searchInput" />
            <button className="btn search-btn">
              <i className="fa fa-search"></i>
            </button>
          </div>
        </div>
        <div className="new-tab" title="Add new tab" onClick={ this.newTabClicked }>
          <i className="fa fa-plus"></i>
        </div>
        <ul className="nav nav-tabs">
          <li className={this.props.selectedTab === "browser"? "active" : ""} onClick={ this.changeSelectedTab('browser') } >
            <a href="#">Open tabs</a>
          </li>
          <li className={ "recent" + (this.props.selectedTab === "recent"? " active" : "")} onClick={ this.changeSelectedTab('recent') }>
            <a href="#"><i className="fa fa-clock-o"></i></a>
          </li>
        </ul>
      </div>
    );
  }
});

module.exports = TopSideBarComponent
