/**
 * @jsx React.DOM
 */

var _state = require('../../state'),
    React = require('react'),
    page = require('page'),
    Tab= require('./common/tab');

var BrowserComponent = React.createClass({
  newTabClicked: function() {
    page('/new');
  },
  removeTab: function(tab) {
    _state.removeItemFromBrowser(tab);
  },
  renderItems: function(parent) {
    var self = this;
    return parent.items.filter(function(itemId){
      var item = _state.getItemById(itemId);
      return item.type !== 2;
    }).map(function(itemId){
      var tab = _state.getItemById(itemId);
      return  (
        <span>
          <Tab
            tab={ tab }
            selectedItem={ self.props.selectedItem }
            removeTab= { self.removeTab }
            viewScreenshot={ self.props.viewScreenshot } />
            { self.renderItems(tab) }
        </span>
      )
    })
  },
  render: function() {
    return (
      <div className="browser">
        <div className="items">
          <div className="clearfix">
            { this.renderItems(_state.browser) }
          </div>
          <div className="new-tab" title="Add new tab" onClick={ this.newTabClicked }>
            <i className="fa fa-plus"></i>
          </div>
        </div>
      </div>
    );
  }
});


module.exports = BrowserComponent
