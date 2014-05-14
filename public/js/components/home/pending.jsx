/**
 * @jsx React.DOM
 */

var _state = require('../../state'),
    util = require('../../util'),
    React = require('react'),
    $ = require('jquery'),
    page = require('page'),
    Tab= require('../common/tab');

var BrowserComponent = React.createClass({
  removeTab: function(tab) {
    _state.serverUpdateItem({
      _id: tab._id,
      deleted: true
    });
  },
  renderItems: function(parent) {
    var self = this;
    return parent.items && parent.items.filter(function(itemId){
      var item = _state.getItemById(itemId);
      return !item.isFolder();
    }).map(function(itemId){
      var tab = _state.getItemById(itemId);
      return  (
        <span>
          <Tab
            tab={ tab }
            selectedItem={ self.props.selectedItem }
            removeTab= { self.removeTab }
            showDropdown={ false }
            viewScreenshot={ self.props.viewScreenshot } />
        </span>
      )
    })
  },
  render: function() {
    return (
      <div className="pending">
        <div className="items">
          <div className="clearfix">
            { this.renderItems(_state.pending) }
          </div>
        </div>
      </div>
    );
  }
});


module.exports = BrowserComponent
