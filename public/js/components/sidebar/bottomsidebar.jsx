/**
 * @jsx React.DOM
 */

var _state = require('../../state'),
    React = require('react');

var bytes = require('bytes');

var BottomSideBarComponent = React.createClass({
  viewScreenshotsClicked: function() {
    this.props.showScreenshots(this.refs.chkScreenshots.getDOMNode().checked);
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
      <div className="bottom-sidebar">
        <ul className="user-options">
          <li className="dropdown dropup nav-option">
            <a draggable="false"  href="#" data-toggle="dropdown" className="dropdown-toggle">
              <i className="fa fa-user"></i>
            </a>
            <ul className="dropdown-menu">
              <li className="username">
                <b>{ _state.username }</b>
              </li>
              <li className="divider"></li>
              <li >
                <a data-toggle="modal" href="/modal/bookmarklet" data-target="#modal">
                  <span>Bookmarklets</span>
                </a>
              </li>
              <li className="divider"></li>
              <li>
                <label className="checkbox">
                  <input type="checkbox" ref="chkScreenshots" onClick={this.viewScreenshotsClicked} />
                  <span>View screenshots</span>
                </label>
              </li>
              <li>
                <a draggable="false"  tabIndex="-1" href="#">
                  <span>Settings</span>
                </a>
              </li>
              <li>
                <a draggable="false"  tabIndex="-1" href="#">
                  <span>Help</span>
                </a>
              </li>
              <li className="divider"></li>
              <li>
                <a draggable="false"  tabIndex="-1" href="/logout">
                  <span>Logout </span>
                </a>
              </li>
            </ul>
          </li>
        </ul>
        <div className="space-text">{this.usageString()}</div>
      </div>
    );
  }
});

module.exports = BottomSideBarComponent
