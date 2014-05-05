/**
 * @jsx React.DOM
 */

var _state = require('../../state'),
    util = require('../../util'),
    React = require('react'),
    $ = require('jquery'),
    Folder = require('./common/folder'),
    Tab= require('./common/tab');

var RecentComponent = React.createClass({
  renderItems: function() {
    var self = this;
    return this.props.items.filter(function(item){
      return !item.isFolder()
        && !item.archiveParent
        && !item.browserParent;
    }).sort(function(item){
      //TODO: check why they are not sorted ok
      return (new Date(item.updatedAt)).getTime();
    }).map(function(item){
      return  <Tab
        tab={ item }
        index={ 0 }
        selectedItem={ self.props.selectedItem }
        showArchiveLabel={ false }
        showDropdown={ false }
        viewScreenshot={ self.props.viewScreenshot } />
    })
  },
  render: function() {
    return (
      <div className="recent">
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

module.exports = RecentComponent
