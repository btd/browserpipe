/**
 * @jsx React.DOM
 */

var _state = require('../state'),
    _ = require('lodash'),
    React = require('react'),
    page = require('page'),
    websocket = require('../websocket/websocket');

var TopBarComponent = React.createClass({    
  getInitialState: function() {
      return {     
          selected: this.props.selected,
      };
  },
  homeOptionClicked: function() { 
    $('#page-section .page-content').contents().find('body').empty();
    $('.url-input').val('');
    page('/item/' + this.state.selected.parent);
  },
  navigateToURL: function() {
     var url = this.refs.urlInput.getDOMNode().value.trim();
     websocket.send('browser.navigate', { itemId: this.state.selected._id, url: url });
  },
  toggleBar: function(){
    //Toggle between bar fixed (pinned) or slide up&down (unpinned)
  },
  render: function() {
    var self = this;
    return (
      <div className="topbar-commands">
	<input type="text" placeholder="Enter an URL or search a tab" className="url-input" ref="urlInput" defaultValue={this.state.selected? this.state.selected.url : ''} />
	<input type="button" className="url-btn btn btn-warning" value="Go"  onClick={this.navigateToURL} />
	<div className="home-option" onClick={ this.homeOptionClicked } >
	  <i className="fa fa-th-large"></i>
	</div>
	<div className="user-options">
	  <li className="nav-option pin-option" onClick={ this.toggleBar } >
	    <i className="fa fa-thumb-tack"></i>
	  </li>
	  <li className="dropdown nav-option">
	    <a draggable="false"  href="#" data-toggle="dropdown" className="dropdown-toggle">
	      <i className="fa fa-user"></i>
	    </a>
	    <ul className="dropdown-menu">
	      <li>
		<a draggable="false"  tabindex="-1" href="/settings">
		  <i className="icon-none"><span>Settings</span></i>
		</a>
	      </li>
	      <li>
		<a draggable="false"  tabindex="-1" href="/help">
		  <i className="icon-none"> <span>Help</span></i>
		</a>
	      </li>
	      <li className="divider"></li>
	      <li>
		<a draggable="false"  tabindex="-1" href="/logout">
		  <i className="icon-none"><span>Logout </span></i>
		</a>
	      </li>
	    </ul>
	  </li>
	</div>
      </div>
    );
  },
  componentDidUpdate: function() {
    if(this.state.selected)
      $('.url-input').val(this.state.selected.url);
  }
});


module.exports.render = function (
    selected
  ) {
  return React.renderComponent(
    <TopBarComponent 
      selected={selected} />,
    document.getElementById('topbar-section')
  );
};
