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
  moveTab: function() {
    _state.moveItemToArchive(
      this.props.tab._id,
      this.props.selectedFolder._id,
      function() {
      var msg = Messenger().post({
        message: "Tab moved",
        hideAfter: 6
      });
    });
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
    var style = {};
    style.width = (100 - (2 * this.props.index)) + "%";
    if(this.props.tab.archiveParent && this.props.showArchiveLabel)
      style.borderLeft= "4px solid #ff6d16;";
    return style;
  },
  isSelected: function() {
    return _state.selectedItem && this.props.selectedItem._id === this.props.tab._id;
  },
  render: function() {
    return (
      <div ref="tab" className={"tab" + (this.isSelected()? " selected": "") } onClick={ this.tabClicked } style={ this.getTabStyle() }>
        { this.renderScreenshot() }
        { this.props.tab.favicon || this.props.tab.title?
            (<div className="tab-footer">
              <img className="tab-favicon" src={this.props.tab.favicon} />
              <span className="tab-title" alt={ this.props.tab.title } >{ this.props.tab.title }</span>
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
