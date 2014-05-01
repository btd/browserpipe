/**
 * @jsx React.DOM
 */

var _state = require('../../state'),
    React = require('react'),
    $ = require('jquery'),
    Folder = require('./common/folder'),
    Tab= require('./common/tab');

var RecentComponent = React.createClass({
  renderItems: function() {
    var self = this;
    return this.props.items.filter(function(item){
      return !item.archiveParent
        && !item.browserParent;
    }).sort(function(item){
      //TODO: check why they are not sorted ok
      return (new Date(item.updatedAt)).getTime();
    }).map(function(item){
      if(item.isFolder())
        return  <Folder folder={ item } />
      else
        return  <Tab
        tab={ item }
        index={ 0 }
        selectedItem={ self.props.selectedItem }
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
  updateScrollbar: function() {
    $('#sidebar-section .recent .items').perfectScrollbar();
  },
  componentDidMount: function() {
    var self = this;
    $(window).resize(function () {
      self.updateScrollbar();
    });
    this.updateScrollbar();
  },
  componentDidUpdate: function() {
    this.updateScrollbar();
  }
});

module.exports = RecentComponent
