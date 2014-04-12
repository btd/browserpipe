/**
 * @jsx React.DOM
 */

var _state = require('../state'),
    _ = require('lodash'),
    React = require('react'),
    page = require('page');

var PageHeaderComponent = React.createClass({
  getInitialState: function() {
      return {
          selectedFolder: this.props.selectedFolder,
          selectedItem: this.props.selectedItem
      };
  },
  closeOptionClicked: function() {
    page("/item/" + this.state.selectedFolder._id);
    if(!$('#topbar-section').hasClass('expanded')) //if expand option is visible, it was collapsed before
      window.parent.postMessage("collapse", "*");
  },
  render: function() {
    return (
      <div>
        <span className="message">{ "This is a snapshot of the page as it appeared on " + this.props.selectedItem.createdAt}</span>
        <a draggable="false" onClick={ this.closeOptionClicked } className="close-option">
          <i className="fa fa-times"></i>
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
