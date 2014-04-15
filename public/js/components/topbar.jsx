/**
 * @jsx React.DOM
 */

var _state = require('../state'),
    React = require('react'),
    page = require('page'),
    browser = require('../browser/main');

var TopBarComponent = React.createClass({
  logoClicked: function() {
    if(this.props.isIframe)
      window.open('/', '_blank');
    else if(_state.selectedItem)
      _state.selectedFolder = _state.getItemById(_state.browser._id);
    else
      page("/item/" + _state.browser._id);
  },
  newFolderClicked: function() {
    _state.serverAddItemToItem(this.props.selectedFolder._id, { type: 2 });
  },
  folderUpClicked: function() {
    if(_state.selectedItem)
      _state.selectedFolder = _state.getItemById(this.props.selectedFolder.parent);
    else
      page("/item/" + this.props.selectedFolder.parent);
  },
  ifEnterNavigate: function(e) {
    if(e.keyCode === 13) this.navigateEnteredURL();
  },
  navigateEnteredURL: function() {
    var url = this.refs.urlInput.getDOMNode().value.trim();
    var parentId = _state.selectedFolder._id;
    browser.createAndOpen(
      parentId,
      url,
      null
    );
  },
  breadcrumbItemClicked: function(e) {
    e.preventDefault();
    var id = $(e.target).data('bpipe-item-id');
    if(_state.selectedItem)
      _state.selectedFolder = _state.getItemById(id);
    else
      page("/item/" + id);
  },
  closeBookmarklet: function(e) {
    e.preventDefault();
    window.parent.postMessage("destroy", "*");
  },
  expandBookmarklet: function(e) {
    e.preventDefault();
    window.parent.postMessage("expand", "*");
    $('#expand-bookmarklet').addClass('hide');
    $('#collapse-bookmarklet').removeClass('hide');
    $('#topbar-section').addClass('expanded');
  },
  collapseBookmarklet: function(e) {
    e.preventDefault();
    window.parent.postMessage("collapse", "*");
    $('#expand-bookmarklet').removeClass('hide');
    $('#collapse-bookmarklet').addClass('hide');
    $('#topbar-section').removeClass('expanded');
  },
  moveTab: function() {
    _state.serverUpdateItem({
      _id: this.props.selectedItem._id,
      parent: this.props.selectedFolder._id
    }, function() {
      var msg = Messenger().post({
        message: "Tab moved",
        hideAfter: 6
      });
    });
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
    return  <div className="breadcrumb"><ol className="breadcrumb-inner">{ breadcrumbItems }</ol></div>
  },
  renderBreadcrumbItem: function(item, last) {
    var title = item.isFolder()? (item.parent? (item.title? item.title : '[No name]') : 'Home') : (item.title? item.title : item.url);
    return <li className={ last? 'active' : ''} >
             { !item.isFolder() && item.favicon? <img src={ item.favicon } alt="Item Favicon" /> : '' }
             { last? title : <a data-bpipe-item-id={ item._id } href="#" onClick={ this.breadcrumbItemClicked }>{ title }</a> }
             { last? '' : <span className="divider">/</span> }
           </li>
  },
  renderMoveOption: function() {
    if(this.props.selectedItem && this.props.selectedItem.parent !== this.props.selectedFolder._id)
      return <div className="move-to-folder" title="Move tab to this folder" onClick={ this.moveTab }>
        <i className="fa fa-caret-square-o-down"></i>
      </div>
  },
  render: function() {
    return (
      <div id="topbar-section">
        <div className="topbar-commands">
          <div className="bookmarklet-options nav-option">
            <a id="close-bookmarklet" draggable="false" onClick={ this.closeBookmarklet } className={ this.props.isIframe? '' : 'hide' }>
              <i className="fa fa-times"></i>
            </a>
            <a id="expand-bookmarklet" draggable="false" onClick={ this.expandBookmarklet } className='hide'>
              <i className="fa fa-expand"></i>
            </a>
            <a id="collapse-bookmarklet" draggable="false" onClick={ this.collapseBookmarklet } className='hide'>
              <i className="fa fa-compress"></i>
            </a>
          </div>
          <div className="search-options input-append">
            <input type="text" placeholder="Enter an URL or search a tab" className="url-input" ref="urlInput" onKeyPress={this.ifEnterNavigate} />
            <input type="button" className="url-btn btn btn-warning" value="Go"  onClick={this.navigateEnteredURL} />
          </div>
          <div className="user-options">
            <li className="dropdown nav-option">
              <a draggable="false"  href="#" data-toggle="dropdown" className="dropdown-toggle">
                <i className="fa fa-user"></i>
              </a>
              <ul className="dropdown-menu">
                { this.props.isIframe? null :
                  (<li >
                    <a data-toggle="modal" href="/modal/bookmarklet" data-target="#modal">
                      <i className="icon-none"><span>Bookmarklets</span></i>
                    </a>
                  </li>)
                }
                { this.props.isIframe? null :
                  <li className="divider"></li>
                }
                <li>
                  <a draggable="false"  tabIndex="-1" href="/settings">
                    <i className="icon-none"><span>Settings</span></i>
                  </a>
                </li>
                <li>
                  <a draggable="false"  tabIndex="-1" href="/help">
                    <i className="icon-none"> <span>Help</span></i>
                  </a>
                </li>
                <li className="divider"></li>
                <li>
                  <a draggable="false"  tabIndex="-1" href="/logout">
                    <i className="icon-none"><span>Logout </span></i>
                  </a>
                </li>
              </ul>
            </li>
          </div>
          <span id="logo" onClick={ this.logoClicked } ><img src={"<%= url('img/logo/logo-small.png') %>"} alt="Browserpipe logo small"/></span>
        </div>
        <div className="sub-bar">
          <div className={"folder-up" + (this.props.selectedFolder.parent?'':' hide')} title="Go one folder up" onClick={ this.folderUpClicked }>
            <i className="fa fa-level-up"></i>
          </div>
          { this.renderBreadcrumb() }
          { this.renderMoveOption() }
          <div className="new-folder" title="Add new folder" onClick={ this.newFolderClicked }>
            <i className="fa fa-folder"></i>
          </div>
        </div>
      </div>
    );
  },
  componentDidUpdate: function() {
    if(!this.props.isIframe || _state.selectedItem) {
      $('#expand-bookmarklet').addClass('hide');
      $('#collapse-bookmarklet').addClass('hide');
    }
    else if (!$('#topbar-section').hasClass('expanded')) {
      $('#expand-bookmarklet').removeClass('hide');
      $('#collapse-bookmarklet').addClass('hide');
    }
    else {
      $('#expand-bookmarklet').addClass('hide');
      $('#collapse-bookmarklet').removeClass('hide');
    }
  }
});

module.exports = TopBarComponent
