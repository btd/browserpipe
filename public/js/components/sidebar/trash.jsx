/**
 * @jsx React.DOM
 */

var _state = require('../../state'),
    util = require('../../util'),
    React = require('react'),
    $ = require('jquery'),
    Folder = require('../common/folder'),
    Tab= require('../common/tab');

var TrashComponent = React.createClass({
  removeTab: function(tab) {
    _state.serverDeleteItem(tab); //We fully delete the item
  },
  renderItems: function() {
    var self = this;
    return this.props.items.filter(function(item){
      return !item.isFolder()
        && item.deleted
    }).sort(function(item){
      //TODO: check why they are not sorted ok
      return (new Date(item.updatedAt)).getTime();
    }).map(function(item){
      return  <Tab
        tab={ item }
        selectedItem={ self.props.selectedItem }
        removeTab= { self.removeTab }
        showDropdown={ true }
        viewScreenshot={ self.props.viewScreenshot } />
    })
  },
  render: function() {
    return (
      <div className="trash">
        <div className="items">
          <div className="clearfix">
            { this.renderItems() }
          </div>
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

module.exports = TrashComponent
