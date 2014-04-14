/**
 * @jsx React.DOM
 */

var _state = require('../state'),
    _ = require('lodash'),
    React = require('react'),
    page = require('page'),
    browser = require('../browser/main');

var PageHeaderComponent = React.createClass({
  getInitialState: function() {
      return {
          selectedFolder: this.props.selectedFolder,
          selectedItem: this.props.selectedItem
      };
  },
  backOptionClicked: function() {
    var previous = this.state.selectedItem.previous;
    if(previous) {
      var parent = _state.getItemById(this.state.selectedItem.parent);
      var index = parent.items.indexOf(this.state.selectedItem._id);
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
    var next = this.state.selectedItem.next;
    if(next) {
      var parent = _state.getItemById(this.state.selectedItem.parent);
      var index = parent.items.indexOf(this.state.selectedItem._id);
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
  refreshOptionClicked: function() {
    browser.createAndOpen(
      this.state.selectedItem.parent,
      this.state.selectedItem.url,
      this.state.selectedItem._id
    );
  },
  closeOptionClicked: function() {
    page("/item/" + this.state.selectedFolder._id);
    if(!$('#topbar-section').hasClass('expanded')) //if expand option is visible, it was collapsed before
      window.parent.postMessage("collapse", "*");
  },
  render: function() {
    return (
      <div>
        <div className="back-option" onClick={ this.backOptionClicked } >
          <i className={"fa fa-arrow-circle-left" + (this.state.selectedItem.previous? "" : " disabled")}></i>
        </div>
        <div className="forward-option" onClick={ this.forwardOptionClicked } >
          <i className={"fa fa-arrow-circle-right" + (this.state.selectedItem.next? "" : " disabled")}></i>
        </div>
        <div className="refresh-option" onClick={ this.refreshOptionClicked } >
          <i className="fa fa-refresh"></i>
        </div>
        <span className="message">{ "This is a snapshot of the page as it appeared on " + this.state.selectedItem.createdAt + ". To open the page "}<a target="_blank" href={this.state.selectedItem.url}>click here</a></span>
        <a draggable="false" onClick={ this.closeOptionClicked } className="close-option">
          <i className="fa fa-angle-double-right"></i>
        </a>
      </div>
    );
  }
});


module.exports.render = function (
    isIframe,
    selectedFolder,
    selectedItem
  ) {
  return React.renderComponent(
    <PageHeaderComponent
      isIframe={isIframe}
      selectedFolder={selectedFolder}
      selectedItem={selectedItem} />,
    document.getElementById('page-header')
  );
};
