/**
 * @jsx React.DOM
 */

var _state = require('../../state'),
    page = require('page'),
    React = require('react');

var bytes = require('bytes');

var UserOptionsComponent = React.createClass({
  homeClicked: function() {
    page('/');
  },
  viewScreenshotsClicked: function() {
    var value = this.refs.chkScreenshots.getDOMNode().checked;
    _state.viewScreenshot = value;
  },
  usageString: function() {
    var size = _state.size();
    return  bytes(size) +
            ' of ' +
            bytes(_state.config.userLimit) +
            ' (' +
            (size > 0 ? (_state.config.userLimit / 100 / size).toFixed(2) : 0) +
            '% used)';
  },

  render: function() {
    return (
      <ul className="user-options">
        <li className="dropdown nav-option">
          <a draggable="false"  href="#" data-toggle="dropdown" className="dropdown-toggle">
            <i className="fa fa-user"></i>
          </a>
          <ul className="dropdown-menu">
            <li className="username">
              <b>{ _state.username }</b>
            </li>
            <li className="divider"></li>
            <li >
              <a href="#" onClick={ this.homeClicked }>
                <span>Home</span>
              </a>
            </li>
            <li >
              <a data-toggle="modal" href="/modal/bookmarklet" data-target="#modal">
                <span>Bookmarklets</span>
              </a>
            </li>
            <li className="divider"></li>
            <li>
              <label className="checkbox">
                <input type="checkbox" ref="chkScreenshots" onClick={this.viewScreenshotsClicked} defaultChecked={ this.props.viewScreenshot }/>
                <span>View screenshots</span>
              </label>
            </li>
            <li className="disabled">
              <a draggable="false"  tabIndex="-1" href="#">
                <span>Settings</span>
              </a>
            </li>
            <li className="disabled">
              <a draggable="false"  tabIndex="-1" href="#">
                <span>Help</span>
              </a>
            </li>
            <li className="divider"></li>
            <li className="space-text">{this.usageString()}</li>
            <li className="divider"></li>
            <li>
              <a draggable="false"  tabIndex="-1" href="/logout">
                <span>Logout </span>
              </a>
            </li>
          </ul>
        </li>
      </ul>
    );
  }
});

module.exports = UserOptionsComponent
