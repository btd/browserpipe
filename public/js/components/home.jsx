/**
 * @jsx React.DOM
 */

var _state = require('../state'),
    util = require('../util'),
    React = require('react'),
    page = require('page'),
    browser = require('../browser/main'),
    UserOptionsComponent = require('./common/useroptions'),
    AdvanceSearchModalComponent = require('./modal/advancesearch'),
    PendingComponent = require('./home/pending');

var HomeComponent = React.createClass({
  getInitialState: function() {
      return {
        sidebarCollapsed: this.props.sidebarCollapsed,
        sidebarTab: this.props.sidebarTab,
        viewScreenshot: this.props.viewScreenshot
      };
  },
  openSidebar: function(e) {
    _state.sidebarCollapsed = false;
  },
  advanceSearchClicked: function(e) {
    e.preventDefault();
    AdvanceSearchModalComponent.render();
  },
  ifEnterNavigate: function(e) {
    if(e.keyCode === 13) this.navigateEnteredURL();
  },
  navigateEnteredURL: function() {
    var url = this.refs.urlInput.getDOMNode().value.trim();
    var parentId = _state.pending._id;
    browser.createAndOpen(
      parentId,
      url,
      function(item) {
        $('#url-input').val('');
      }
    );
  },
  renderSidebarIcon: function() {
    if(this.state.sidebarCollapsed)
      return <span className="open-sidebar" onClick={ this.openSidebar }>
               <i className="fa fa-bars"></i>
             </span>
  },
  render: function() {
    return (
      <div className="home-inner" >
        { this.renderSidebarIcon() }
        <UserOptionsComponent
          viewScreenshot={ this.state.viewScreenshot }
          sidebarCollapsed={ this.state.sidebarCollapsed }
          sidebarTab={this.state.sidebarTab} />
        <div className="home-content">
          <span className="logo"><img src={"<%= url('img/logo/logo.png') %>"} alt="Browserpipe logo small"/></span>
          <div>
            <span className="home-input">
              <input type="text" placeholder="Search or add an URL" id="url-input" ref="urlInput" onKeyPress={this.ifEnterNavigate} />
              <input type="button" id="url-btn" value="Go"  onClick={this.navigateEnteredURL} />
              <a className="advance-search" href="#" onClick={this.advanceSearchClicked} >advance search</a>
            </span>
          </div>
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
