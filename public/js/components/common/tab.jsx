/**
 * @jsx React.DOM
 */

var _state = require('../../state'),
    util = require('../../util'),
    React = require('react'),
    page = require('page');

var BASE_REMINDER_DAYS = 60;

var TabComponent = React.createClass({
  tabClicked: function() {
    page("/item/" + this.props.tab._id);
  },
  archiveOptionClicked: function(e) {
    var SelectFolderModalComponent = require('../modal/selectfolder'); //Include here to avoid recursion
    e.stopPropagation();
    e.preventDefault();
    SelectFolderModalComponent.render(this.props.tab);
  },
  removeOptionClicked: function(e) {
    e.stopPropagation();
    e.preventDefault();
    this.props.removeTab(this.props.tab);
  },
  renderScreenshot: function() {
    if(this.props.viewScreenshot)
      return <div className="tab-content">
               { this.props.tab.screenshot?
                 <img className="tab-screenshot"
                      alt="Screenshot"
                      src={ this.props.tab.screenshot }
                      style={ this.props.tab.screenshot? this.getScreenshotTopAndLeft() : {top: '30px', left: '72px'} }
                      draggable="false"
                  /> : null
               }
             </div>;
  },
  getTabStyle: function() {
    if(this.props.showColorReminder) {
      var time = new Date(this.props.tab.updatedAt);
      var base = new Date();
      base.setDate(base.getDate() - BASE_REMINDER_DAYS);
      var difference = time.getTime() - base.getTime();
      var total = BASE_REMINDER_DAYS * 24 * 60 * 60 * 1000;
      var redOpacity = time <= base ? 1 : (1- (difference / total));
      return { backgroundColor: "rgba(255,0,0," + redOpacity + ");" }
    }
    else return {};
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
  isInArchive: function() {
    var item = this.props.tab;
    return util.isItemInArchive(item, _state);
  },
  isSelected: function() {
    return this.props.selectedItem && this.props.selectedItem._id === this.props.tab._id;
  },
  render: function() {
    return (
      <div data-br-id={'tab_' + this.props.tab._id}
           ref="tab" className={"tab" + (this.isSelected()? " selected": "") }
           style={ this.getTabStyle() }
           title={ this.props.tab.title }
           onClick={ this.tabClicked }
           draggable="true" >
        { this.renderScreenshot() }
        { this.props.tab.favicon || this.props.tab.title?
            (<div className="tab-footer">
              <img className="tab-favicon" src={this.props.tab.favicon} draggable="false" />
              <span className="tab-title" >{ this.props.tab.title }</span>
              {
                this.props.hideDropdown? null:
                (<ul className="tab-options" onClick={ function(e){ e.stopPropagation(); } }>
                  <li className="dropdown nav-option">
                    <a draggable="false"  href="#" data-toggle="dropdown" className="dropdown-toggle">
                      <i className="fa fa-chevron-down"></i>
                    </a>
                    <ul className="dropdown-menu">
                      <li>
                        <a draggable="false" tabIndex="-1" href="#" onClick={ this.archiveOptionClicked } >
                          <span>{ this.props.tab.deleted? "Restore" : (this.isInArchive()? "Move" : "Archive") }</span>
                        </a>
                      </li>
                      <li className="divider"></li>
                      <li>
                        <a draggable="false" tabIndex="-1" href="#" onClick={ this.removeOptionClicked }>
                          <span>{ this.props.tab.deleted? "Delete forever" : "Remove" }</span>
                        </a>
                      </li>
                    </ul>
                  </li>
                </ul>)
              }
            </div>) :
            (<div className="tab-loader"><img src="<%= url('img/loader-small.gif') %>" alt="Loading" /></div>)
        }
      </div>
    );
  }
});

module.exports = TabComponent
