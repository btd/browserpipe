/**
 * @jsx React.DOM
 */

var _state = require('../../state'),
    React = require('react'),
    Folder = require('./common/folder'),
    Tab= require('./common/tab');

var TrashComponent = React.createClass({
  removeTab: function(tab) {
    //TODO: definitive delete item
  },
  renderFolders: function() {
    var self = this;
    return _state.items.filter(function(item){
      return item.type === 2 
        && !item.archiveParent 
        && !item.browserParent 
        && item._id !== _state.browser._id 
        && item._id !== _state.archive._id;
    }).map(function(folder){
      return  <Folder folder={ folder } />
    })
  },
  renderItems: function() {
    var self = this;
    return _state.items.filter(function(item){
      return item.type !== 2 
        && !item.archiveParent 
        && !item.browserParent;
    }).map(function(tab){
      return  <Tab
        tab={ tab }
        selectedItem={ self.props.selectedItem }
        removeTab= { self.removeTab }
        viewScreenshot={ self.props.viewScreenshot } />
    })
  },
  render: function() {
    return (
      <div className="trash">
        <div className="items">
          <div className="clearfix">
            { this.renderFolders() }
          </div>
          <div className="clearfix">
            { this.renderItems() }
          </div>
        </div>
      </div>
    );
  }
});

module.exports = TrashComponent
