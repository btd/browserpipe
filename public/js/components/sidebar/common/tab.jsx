/**
 * @jsx React.DOM
 */

var _state = require('../../../state'),
    React = require('react'),
    page = require('page');

var TabComponent = React.createClass({
  tabClicked: function() {
    page("/item/" + this.props.tab._id);
  },
  openURLClicked: function(e) {
    e.stopPropagation();
  },
  removeOptionClicked: function(e) {
    e.stopPropagation();
    this.props.removeTab(this.props.tab);
  },
  renderScreenshot: function() {
    if(this.props.viewScreenshot)
    return <div className="tab-content">
      <img className="tab-screenshot" src={this.props.tab.screenshot? this.props.tab.screenshot: '/img/loader.gif'} style={ this.props.tab.screenshot? this.getScreenshotTopAndLeft() : {top: '30px', left: '72px'} } />
    </div>;
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
      <div ref="tab" className={"tab" + (this.props.selectedItem && this.props.selectedItem._id === this.props.tab._id? " selected": "") } onClick={ this.tabClicked } >
        <div className="mask" >
          <div className="mask-options">
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
        { this.renderScreenshot() }
        { this.props.tab.favicon || this.props.tab.title?
            (<div className="tab-footer">
              <img className="tab-favicon" src={this.props.tab.favicon} />
              <span className="tab-title" alt={ this.props.tab.title } >{ this.props.tab.title }</span>
            </div>) :
            (<img className="tab-loader" src="/img/loader.gif" alt="loading" />)
        }
      </div>
    );
  }
});

module.exports = TabComponent
