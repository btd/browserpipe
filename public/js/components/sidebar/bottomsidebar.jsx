/**
 * @jsx React.DOM
 */

var _state = require('../../state'),
    React = require('react');

var BottomSideBarComponent = React.createClass({

  closeSidebarClicked: function(e) {
    _state.sidebarCollapsed = true;
  },
  render: function() {
    return (
      <div className="bottom-sidebar">
        <div className="bottom-text" onClick={ this.closeSidebarClicked } >close</div>
      </div>
    );
  }
});

module.exports = BottomSideBarComponent
