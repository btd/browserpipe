/**
 * @jsx React.DOM
 */

var _state = require('../state'),
    _ = require('lodash'),
    $ = require('jquery'),
    React = require('react'),
    page = require('page');

var TabComponent = React.createClass({    
  tabMaskClicked: function() {
    page("/item/" + this.props.tab._id);
  },
  removeOptionClicked: function(e) {
    e.stopPropagation();
    _state.serverDeleteItem(this.props.tab);
  },
  openURLClicked: function(e) { 
    e.stopPropagation();
  },
  getScreenshotTopAndLeft: function() {
    var wratio = 252 / this.props.tab.windowWidth;
    var top =  wratio * -this.props.tab.scrollY;
    var left = wratio * -this.props.tab.scrollX;
    return { top: top, left: left }
  },
  render: function() {
    return (
      <div ref="tab" className="tab" >
        <div className="tab-mask" onClick={ this.tabMaskClicked } >
          <div className="tab-mask-options">
            <div className="tab-mask-option" onClick={ this.removeOptionClicked } >
              <i className="fa fa-times"></i>
            </div>
            <div className="tab-mask-option">
              <a target="_blank" href={ this.props.tab.url } onClick={ this.openURLClicked }  >
	        <i className="fa fa-share"></i>
	      </a>
            </div>
          </div>
          <div className="tab-mask-text" >Click to open</div>
        </div>
        <div className="tab-content">
	  <img className="tab-screenshot" src={this.props.tab.screenshot} style={ this.getScreenshotTopAndLeft() } />
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
