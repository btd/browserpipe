/**
 * @jsx React.DOM
 */

var _state = require('../../state'),
    React = require('react');

var SidebarOptionComponent = React.createClass({
  openSidebar: function(e) {
    _state.sidebarCollapsed = false;
  },
  render: function() {
    if(this.props.sidebarCollapsed)
      return <span className="open-sidebar" onClick={ this.openSidebar }>
               <i className="fa fa-bars"></i>
             </span>
    else return <span/>
  }
});

module.exports = SidebarOptionComponent
