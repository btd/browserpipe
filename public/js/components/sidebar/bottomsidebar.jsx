/**
 * @jsx React.DOM
 */

var _state = require('../../state'),
    React = require('react');

var BottomSideBarComponent = React.createClass({
  viewScreenshotsClicked: function() {
    this.props.showScreenshots(this.refs.chkScreenshots.getDOMNode().checked);
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
              <li>
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
        <div className="space-text">4.5 GB (90%) of 5 GB used</div>
      </div>
    );
  }
});

module.exports = BottomSideBarComponent
