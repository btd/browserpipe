/**
 * @jsx React.DOM
 */

var _state = require('../../state'),
    util = require('../../util'),
    React = require('react'),
    $ = require('jquery'),
    page = require('page'),
    ArchiveComponent = require('./archive'),
    Tab= require('./common/tab');

var BrowserComponent = React.createClass({
  newTabClicked: function() {
    page('/new');
  },
  removeTab: function(tab) {
    _state.removeItemFromBrowser(tab);
  },
  renderItems: function(parent, index) {
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
            index={ index }
            selectedItem={ self.props.selectedItem }
            removeTab= { self.removeTab }
            showArchiveLabel={ true }
            showDropdown={ false }
            viewScreenshot={ self.props.viewScreenshot } />
            { self.renderItems(tab, index + 1) }
        </span>
      )
    })
  },
  render: function() {
    return (
      <div className="browser">
        <div className="items">
          <div className="clearfix">
            { this.renderItems(_state.browser, 0) }
          </div>
          <div className="new-tab" title="Add new tab" onClick={ this.newTabClicked }>
            <i className="fa fa-plus"></i>
          </div>
          <ArchiveComponent
            viewScreenshot={ this.props.viewScreenshot }
            selectedFolder={ this.props.selectedFolder }
            selectedItem={ this.props.selectedItem } />
        </div>
      </div>
    );
  },
  componentDidMount: function(){
    //On first load, we scroll to the item if there is one
    if(this.props.selectedItem)
      util.scrollToItem(this.props.selectedItem);
  }
});


module.exports = BrowserComponent
