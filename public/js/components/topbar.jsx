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
    var previous = this.state.selected.previous;
    if(previous) {
      var parent = _state.getItemById(this.state.selected.parent);
      var index = parent.items.indexOf(this.state.selected._id);
      if(index >= 0) { 
        parent.items[index] = previous;
	_state.serverUpdateItem({
	  _id: parent._id,
	  items: parent.items
	}, function() {
	  page('/item/' + previous);
	});
      }
    }
  },
  forwardOptionClicked: function() { 
    var next = this.state.selected.next;
    if(next) {
      var parent = _state.getItemById(this.state.selected.parent);
      var index = parent.items.indexOf(this.state.selected._id);
      if(index >= 0) { 
        parent.items[index] = next;
	_state.serverUpdateItem({
	  _id: parent._id,
	  items: parent.items
	}, function() {
	  page('/item/' + next);
	});
      }
    }
  },
  homeOptionClicked: function() { 
    $('#page-section .page-content').contents().find('body').empty();
    $('.url-input').val('');
    page('/item/' + this.state.selected.parent);
  },
  refreshOptionClicked: function() { 
    this.navigateToURL(this.state.selected.url);
  },
  ifEnterNavigate: function(e) {
    if(e.keyCode === 13) this.navigateEnteredURL();
  },
  navigateEnteredURL: function() {
    var url = this.refs.urlInput.getDOMNode().value.trim();
    this.navigateToURL(url);
  },
  navigateToURL: function(url) {
    if(this.state.selected.isFolder() //if we are in a folder we create a new tab with url
      || this.state.selected.url //If tab url is a "navigated" item, so we create a new tab for the new url
    ){      
      var parentId = this.state.selected.isFolder()? this.state.selected._id : this.state.selected.parent;
      var previousId = this.state.selected.isFolder()? null : this.state.selected._id;
      browser.createAndOpen(
        parentId, 
	url, 
	previousId
      );
    }
    else  browser.open(url);
  },
  toggleBar: function(){
    //Toggle between bar fixed (pinned) or slide up&down (unpinned)
  },
  breadcrumbItemClicked: function(e) {
    e.preventDefault();
    var id = $(e.target).data('bpipe-item-id');
    page('/item/' + id);
  },
  renderBreadcrumb: function() {
    var breadcrumbItems = [];
    var last = true;
    var item = this.state.selected;
    while(item) {
      breadcrumbItems.unshift(this.renderBreadcrumbItem(item, last));
      item = item.parent? _state.getItemById(item.parent) : null;
      last = false;
    }
    return  <ol className="breadcrumb">{ breadcrumbItems }</ol>
  },
  renderBreadcrumbItem: function(item, last) {
    var title = item.isFolder()? (item.parent? (item.title? item.title : '[No name]') : 'Home') : (item.title? item.title : item.url);
    return <li className={ last? 'active' : ''} >
             { !item.isFolder() && item.favicon? <img src={ item.favicon } alt="Item Favicon" /> : '' }
             { last? title : <a data-bpipe-item-id={ item._id } href="#" onClick={ this.breadcrumbItemClicked }>{ title }</a> }
             { last? '' : <span className="divider">/</span> }
           </li>
  },
  render: function() {
    return (
      <div>
	<div className="topbar-commands">
	  <span id="logo"><img src="/img/logo/logo-small.png" alt="Browserpipe logo small"/></span>
	  <div className="navigate-options">
	    <div className="back-option" onClick={ this.backOptionClicked } >
	      <i className={"fa fa-arrow-circle-left" + (this.state.selected.isFolder()? " hide": (this.state.selected.previous? "" : " disabled"))}></i>
	    </div>
	    <div className="forward-option" onClick={ this.forwardOptionClicked } >
	      <i className={"fa fa-arrow-circle-right" + (this.state.selected.isFolder()? " hide": (this.state.selected.next? "" : " disabled"))}></i>
	    </div>
	    <div className="refresh-option" onClick={ this.refreshOptionClicked } >
	      <i className={"fa fa-refresh" + (this.state.selected.isFolder()? " hide": "")}></i>
	    </div>
	  </div>
	  <div className="search-options input-append">
	    <input type="text" placeholder="Enter an URL or search a tab" className="url-input" ref="urlInput" onKeyPress={this.ifEnterNavigate} defaultValue={this.state.selected.isFolder()? '': this.state.selected.url } />
	    <input type="button" className="url-btn btn btn-warning" value="Go"  onClick={this.navigateEnteredURL} />
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
		  <a tabindex="-1" href={ "javascript:(function(){BROWSERPIPE_DOMAIN='" + window.location.protocol + "//" + window.location.host + "';_my_script=document.createElement('SCRIPT');_my_script.type='text/javascript';_my_script.src=BROWSERPIPE_DOMAIN+'/js/bookmarklet/bookmarklet.js?x='+(Math.random());document.getElementsByTagName('head')[0].appendChild(_my_script);})();"}>
		    <i className="icon-none"><span>✚ Add to Browserpipe</span></i>
		  </a>
		</li>
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
	{ this.renderBreadcrumb() }
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
