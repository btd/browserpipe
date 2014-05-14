/**
 * @jsx React.DOM
 */

var _state = require('../../state'),
    React = require('react');

var BottomSideBarComponent = React.createClass({

  render: function() {
    return (
      <div className="bottom-sidebar">
        <div className="bottom-text">{"Total in folder: " + this.props.selectedFolder.items.length }</div>
      </div>
    );
  }
});

module.exports = BottomSideBarComponent
