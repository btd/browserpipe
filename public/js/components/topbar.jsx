/**
 * @jsx React.DOM
 */

var _state = require('../state'),
    _ = require('lodash'),
    React = require('react'),
    page = require('page'),
    browser = require('../browser/main');

var TopBarComponent = React.createClass({
  /*backOptionClicked: function() {
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
  },*/
  logoClicked: function() {
//    $('#page-section .page-content').contents().find('body').empty();
//    $('.url-input').val('');
//    page('/item/' + _state.browser._id);
  },
  /*refreshOptionClicked: function() {
    this.navigateToURL(this.state.selected.url);
  },*/
  ifEnterNavigate: function(e) {
    if(e.keyCode === 13) this.navigateEnteredURL();
  },
  navigateEnteredURL: function() {
    var url = this.refs.urlInput.getDOMNode().value.trim();
    this.navigateToURL(url);
  },
  navigateToURL: function(url) {
    /*if(this.state.selected.isFolder() //if we are in a folder we create a new tab with url
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
    else  browser.open(url);*/
  },
  breadcrumbItemClicked: function(e) {
    e.preventDefault();
    var id = $(e.target).data('bpipe-item-id');
    if(_state.selectedItem)
      _state.selectedFolder = _state.getItemById(id);
    else
      page("/item/" + id);
  },
  expand: function(e) {
    e.preventDefault();
    window.parent.postMessage("expand", "*");
    this.refs.expandOption.getDOMNode().className = "hide";
    this.refs.collapseOption.getDOMNode().className = "";
  },
  collapse: function(e) {
    e.preventDefault();
    window.parent.postMessage("collapse", "*");
    this.refs.expandOption.getDOMNode().className = "";
    this.refs.collapseOption.getDOMNode().className = "hide";
  },
  renderBreadcrumb: function() {
    var breadcrumbItems = [];
    var last = true;
    var folder = this.props.selectedFolder;
    while(folder) {
      breadcrumbItems.unshift(this.renderBreadcrumbItem(folder, last));
      folder = folder.parent? _state.getItemById(folder.parent) : null;
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
      <div id="topbar-section">
        <div className="topbar-commands">
          <span id="logo" onClick={ this.logoClicked } ><img src="/img/logo/logo-small.png" alt="Browserpipe logo small"/></span>
          <div className="search-options input-append">
            <input type="text" placeholder="Enter an URL or search a tab" className="url-input" ref="urlInput" onKeyPress={this.ifEnterNavigate} defaultValue=/*{this.state.selected.isFolder()? '': this.state.selected.url }*/ '' />
            <input type="button" className="url-btn btn btn-warning" value="Go"  onClick={this.navigateEnteredURL} />
          </div>
          <div className="user-options">
            <li className="dropdown nav-option">
              <a id="expand-dashboard" draggable="false" onClick={ this.expand } ref="expandOption" className={ this.props.isIframe && !_state.selectedItem? '' : 'hide' }>
                <i className="fa fa-expand"></i>
              </a>
              <a draggable="false" onClick={ this.collapse } ref="collapseOption" className='hide'>
                <i className="fa fa-compress"></i>
              </a>
              <a draggable="false"  href="#" data-toggle="dropdown" className="dropdown-toggle">
                <i className="fa fa-user"></i>
              </a>
              <ul className="dropdown-menu">
                <li>
                  <a data-toggle="modal" href="/modal/bookmarklet" data-target="#modal">
                    <i className="icon-none"><span>Bookmarklets</span></i>
                  </a>
                </li>
                <li className="divider"></li>
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
    //if(!this.state.selected.isFolder())
      //$('.url-input').val(this.state.selected.url);
  }
});

module.exports = TopBarComponent
