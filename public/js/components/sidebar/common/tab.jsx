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
  getTabStyle: function() {
    var width = 248 - (10 * this.props.index);
    var left = 9 + (10 * this.props.index);
    return {
      width: width,
      marginLeft: left
    }
  },
  renderLabel: function() {
    if(this.props.tab.browserParent && _state.sidebarTab === "archive")
      return <span className="label label-info tab-label">b</span>
    else if(this.props.tab.archiveParent && _state.sidebarTab === "browser")
      return <span className="label label-success tab-label">a</span>
  },
  render: function() {
    return (
      <div ref="tab" className={"tab" + (this.props.selectedItem && this.props.selectedItem._id === this.props.tab._id? " selected": "") } onClick={ this.tabClicked } style={ this.getTabStyle() }>
        { this.renderScreenshot() }
        { this.props.tab.favicon || this.props.tab.title?
            (<div className="tab-footer">
              <img className="tab-favicon" src={this.props.tab.favicon} />
              <span className="tab-title" alt={ this.props.tab.title } >{ this.props.tab.title }</span>
              { this.renderLabel() }
              { this.props.removeTab?
                <div className="remove-option right" onClick={ this.removeOptionClicked } >
                  <i className="fa fa-times"></i>
                </div>: null }
            </div>) :
            (<img className="tab-loader" src="/img/loader.gif" alt="loading" />)
        }
      </div>
    );
  }
});

module.exports = TabComponent
