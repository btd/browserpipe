/**
 * @jsx React.DOM
 */

var _state = require('../state'),
    $ = require('jquery'),
    React = require('react'),
    page = require('page');

var TabComponent = React.createClass({
  tabClicked: function() {
    page("/item/" + this.props.tab._id);
  },
  maskClicked: function(e) {
    e.stopPropagation();
  },
  selectOptionClicked: function(e) {
    e.stopPropagation();
  },
  removeOptionClicked: function(e) {
    e.stopPropagation();
    _state.serverDeleteItem(this.props.tab);
  },
  openURLClicked: function(e) {
    e.stopPropagation();
  },
  getScreenshotTopAndLeft: function() {
    if(this.props.tab.scrollY >= 0 && this.props.tab.scrollX >= 0) {
      var wratio = 252 / this.props.tab.windowWidth;
      var top =  wratio * -this.props.tab.scrollY;
      var left = wratio * -this.props.tab.scrollX;
      return { top: top, left: left }
    }
    else return { top: 0, left: 0 }
  },
  render: function() {
    return (
      <div ref="tab" className="tab" onClick={ this.tabClicked } >
        <div className="mask" onClick={ this.maskClicked } >
          <div className="mask-options">
            <div className="mask-option left" onClick={ this.selectOptionClicked } >
              <input type="checkbox" className="select-item" />
            </div>
            <div className="mask-option right" onClick={ this.removeOptionClicked } >
              <i className="fa fa-times"></i>
            </div>
            <div className="mask-option right">
              <a target="_blank" href={ this.props.tab.url } onClick={ this.openURLClicked }  >
	        <i className="fa fa-share"></i>
	      </a>
            </div>
          </div>
        </div>
        <div className={"tab-content" + (this.props.selectedItem && this.props.selectedItem._id === this.props.tab._id? " selected": "") }>
          <img className="tab-screenshot" src={this.props.tab.screenshot? this.props.tab.screenshot: '/img/loader.gif'} style={ this.props.tab.screenshot? this.getScreenshotTopAndLeft() : {top: '30px', left: '72px'} } />
        </div>
        <div className="tab-footer">
          <img className="tab-favicon" src={this.props.tab.favicon} />
          <span className="tab-title" alt={ this.props.tab.title } >{ this.props.tab.title }</span>
        </div>
      </div>
    );
  }
});

module.exports = TabComponent
