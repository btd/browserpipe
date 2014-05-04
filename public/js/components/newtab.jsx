/**
 * @jsx React.DOM
 */

var _state = require('../state'),
    util = require('../util'),
    React = require('react'),
    page = require('page'),
    browser = require('../browser/main');

var NewTabComponent = React.createClass({
  getInitialState: function() {
      return {
      };
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
      null,
      function(item) {
        $('#url-input').val('');
        util.scrollToItem(item);
      }
    );
  },
  render: function() {
    return (
      <div className="new-tab">
        <div className="new-tab-content">
          <span className="logo"><img src={"<%= url('img/logo/logo.png') %>"} alt="Browserpipe logo small"/></span>
          <div className="new-tab-input">
            <input type="text" placeholder="Enter an URL" id="url-input" ref="urlInput" onKeyPress={this.ifEnterNavigate} />
            <input type="button" id="url-btn" value="Go"  onClick={this.navigateEnteredURL} />
          </div>
          <div className="bookmarklet-note">
            <span>or install our </span>
            <a data-toggle="modal" href="/modal/bookmarklet" data-target="#modal">bookmarklet</a>
            <span> to add tabs directly from your browser</span>
          </div>
        </div>
      </div>
    );
  }
});


module.exports.render = function (
  ) {
  return React.renderComponent(
    <NewTabComponent />,
    document.getElementById('new-tab-section')
  );
};
