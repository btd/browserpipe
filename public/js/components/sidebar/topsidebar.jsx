/**
 * @jsx React.DOM
 */

var React = require('react'),
    _state = require('../../state');

var TopSideBarComponent = React.createClass({
  changeSelectedTab: function(value) {
    return function() { _state.sidebarTab = value; };
  },
  render: function() {
    return (
      <div className="top-sidebar">
        <div className="commands">
          <span className="logo"><img src={"<%= url('img/logo/logo-small.png') %>"} alt="Browserpipe logo small"/></span>
          <div className="search-options">
            <input type="text" placeholder="Search a tab" className="search-input" ref="searchInput" />
            <input type="button" className="search-btn" value="Search" />
          </div>
        </div>
        <ul className="nav nav-tabs">
          <li className={this.props.selectedTab === "browser"? "active" : ""} onClick={ this.changeSelectedTab('browser') } >
            <a href="#">Browser</a>
          </li>
          <li className={this.props.selectedTab === "archive"? "active" : ""} onClick={ this.changeSelectedTab('archive') }>
            <a href="#">Archive</a>
         </li>
          <li className={ "trash" + (this.props.selectedTab === "trash"? " active" : "")} onClick={ this.changeSelectedTab('trash') }>
            <a href="#"><i className="fa fa-trash-o"></i></a>
          </li>
        </ul>
      </div>
    );
  }
});

module.exports = TopSideBarComponent
