/**
 * @jsx React.DOM
 */

var _state = require('../state'),
    _ = require('lodash'),
    React = require('react'),
    page = require('page'),
    browser = require('../browser/main');

var TopBarComponent = React.createClass({    
  getInitialState: function() {
      return {     
          selected: this.props.selected,
      };
  },
  backOptionClicked: function() { 
  },
  forwardOptionClicked: function() { 
  },
  homeOptionClicked: function() { 
    $('#page-section .page-content').contents().find('body').empty();
    $('.url-input').val('');
    page('/item/' + this.state.selected.parent);
  },
  ifEnterNavigate: function(e) {
    if(e.keyCode === 13) this.navigateToURL();
  },
  navigateToURL: function() {
    var url = this.refs.urlInput.getDOMNode().value.trim();
    if(this.state.selected.isFolder() //if we are in a folder we create a new tab with url
      || this.state.selected.url //If tab url is a "navigated" item, so we create a new tab for the new url
    ){      
      var parent = this.state.selected.isFolder()? this.state.selected._id : this.state.selected.parent;
      _state.serverAddItemToItem(parent, { type: 0, url: url }, function(item) {
	//TODO: navigation to the just added container is not working because websockets is taking more time to add it than ajax reponse.
	//We should fix this by sending crud request to server via websockets instead of ajax.
	setTimeout(function() { 
	  page('/item/' + item._id);
	}, 500); 
      });
    }
    else  browser.open(this.state.selected._id, url);
  },
  toggleBar: function(){
    //Toggle between bar fixed (pinned) or slide up&down (unpinned)
  },
  render: function() {
    return (
      <div className="topbar-commands">
        <span id="logo"><img src="/img/logo/logo-small.png" alt="Browserpipe logo small"/></span>
        <div className="navigate-options">
	  <div className="back-option" onClick={ this.backOptionClicked } >
	    <i className={"fa fa-arrow-circle-left" + (this.state.selected.isFolder()? " hide": "")}></i>
	  </div>
	  <div className="forward-option" onClick={ this.forwardOptionClicked } >
	    <i className={"fa fa-arrow-circle-right" + (this.state.selected.isFolder()? " hide": "")}></i>
	  </div>
	</div>
	<div className="search-options input-append">
	  <input type="text" placeholder="Enter an URL or search a tab" className="url-input" ref="urlInput" onKeyPress={this.ifEnterNavigate} defaultValue={this.state.selected.isFolder()? '': this.state.selected.url } />
	  <input type="button" className="url-btn btn btn-warning" value="Go"  onClick={this.navigateToURL} />
	</div>
	<div className="home-option" onClick={ this.homeOptionClicked } >
	  <i className={"fa fa-th-large" + (this.state.selected.isFolder()? " hide": "")}></i>
	</div>
	<div className="user-options">
	  <li className="nav-option pin-option" onClick={ this.toggleBar } >
	    <i className={"fa fa-thumb-tack" + (this.state.selected.isFolder()? " hide": "")}></i>
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
    if(!this.state.selected.isFolder())
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
