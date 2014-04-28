/**
 * @jsx React.DOM
 */

var _state = require('../state'),
    React = require('react'),
    page = require('page'),
    browser = require('../browser/main');

var TabHeaderComponent = React.createClass({
  getInitialState: function() {
      return {
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
        <span className="labels">
          <span className={"label label-info" + (this.state.selectedItem.browserParent?'':' hide')}>browser</span>
          <span className={"label label-success" + (this.state.selectedItem.archiveParent?'':' hide')}>archive</span>
          <span className={"label label-important" + (this.state.selectedItem.browserParent || this.state.selectedItem.archiveParent?' hide':'')}>trash</span>
        </span>
        <ul className="tab-options">
          <li className="dropdown nav-option">
            <a draggable="false"  href="#" data-toggle="dropdown" className="dropdown-toggle">
              <i className="fa fa-gear"></i>
            </a>
            <ul className="dropdown-menu">
              <li>
                <a draggable="false"  tabIndex="-1" href="#">
                  <i className="icon-none"><span>Edit</span></i>
                </a>
              </li>
              <li>
                <a draggable="false"  tabIndex="-1" href="#">
                  <i className="icon-none"><span>Comment</span></i>
                </a>
              </li>
              <li>
                <a draggable="false"  tabIndex="-1" href="#">
                  <i className="icon-none"><span>Share</span></i>
                </a>
              </li>
              <li className="divider"></li>
              <li>
                <a draggable="false"  tabIndex="-1" href="#">
                  <i className="icon-none"><span>Un-archive</span></i>
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    );
  }
});


module.exports.render = function (
    selectedItem
  ) {
  return React.renderComponent(
    <TabHeaderComponent
      selectedItem={selectedItem} />,
    document.getElementById('tab-header')
  );
};
