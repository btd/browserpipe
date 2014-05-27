/**
 * @jsx React.DOM
 */

var _state = require('../state'),
    util = require('../util'),
    React = require('react'),
    page = require('page'),
    UserOptions = require('./common/useroptions'),
    SidebarOption = require('./common/sidebaroption'),
    SearchBox = require('./home/searchbox'),
    PendingComponent = require('./home/pending');

var HomeComponent = React.createClass({
  getInitialState: function() {
      return {
        sidebarCollapsed: this.props.sidebarCollapsed,
        sidebarTab: this.props.sidebarTab,
        viewScreenshot: this.props.viewScreenshot
      };
  },
  render: function() {
    return (
      <div className="home-inner" >
        <SidebarOption
          sidebarCollapsed={ this.state.sidebarCollapsed } />
        <UserOptions
          viewScreenshot={ this.state.viewScreenshot }
          sidebarCollapsed={ this.state.sidebarCollapsed }
          sidebarTab={this.state.sidebarTab} />
        <div className="home-content">
          <span className="logo"><img src={"<%= url('img/logo/logo.png') %>"} alt="Browserpipe logo small"/></span>
          <SearchBox />
          <div className="bookmarklet-note">
            <span>or install our </span>
            <a data-toggle="modal" href="/modal/bookmarklet" data-target="#modal-bookmarklet">bookmarklet</a>
            <span> to add tabs directly from your browser</span>
          </div>
          <PendingComponent
            viewScreenshot={ this.state.viewScreenshot } />
        </div>
      </div>
    );
  },
  updateMargins: function() {
    if(this.state.sidebarCollapsed) $('#home-section').removeClass('with-sidebar');
    else $('#home-section').addClass('with-sidebar');
  },
  componentDidMount: function() { this.updateMargins(); },
  componentDidUpdate: function() { this.updateMargins(); }
});


module.exports.render = function (
    sidebarCollapsed,
    sidebarTab,
    viewScreenshot
  ) {
  return React.renderComponent(
    <HomeComponent
      sidebarCollapsed={sidebarCollapsed}
      sidebarTab={sidebarTab}
      viewScreenshot={viewScreenshot} />,
    document.getElementById('home-section')
  );
};
