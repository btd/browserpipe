/**
 * @jsx React.DOM
 */

var _state = require('../../state'),
    React = require('react'),
    page = require('page');

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
               <img className="tab-screenshot" alt="Screenshot" src={this.props.tab.screenshot? this.props.tab.screenshot: "<%= url('img/loader-small.gif') %>" } style={ this.props.tab.screenshot? this.getScreenshotTopAndLeft() : {top: '30px', left: '72px'} } />
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
  isSelected: function() {
    return this.props.selectedItem && this.props.selectedItem._id === this.props.tab._id;
  },
  render: function() {
    return (
      <div data-br-id={'tab_' + this.props.tab._id} ref="tab" className={"tab" + (this.isSelected()? " selected": "") } title={ this.props.tab.title } onClick={ this.tabClicked } >
        { this.renderScreenshot() }
        { this.props.tab.favicon || this.props.tab.title?
            (<div className="tab-footer">
              <img className="tab-favicon" src={this.props.tab.favicon} />
              <span className="tab-title" >{ this.props.tab.title }</span>
              { !this.props.removeTab? null:
                (!this.props.showDropdown? (
                  <span className="remove-option" onClick={ this.removeOptionClicked } >
                    <i className="fa fa-times"></i>
                  </span>):
                  (<ul className="tab-options" onClick={ function(e){ e.stopPropagation(); } }>
                    <li className="dropdown nav-option">
                      <a draggable="false"  href="#" data-toggle="dropdown" className="dropdown-toggle">
                        <i className="fa fa-chevron-down"></i>
                      </a>
                      <ul className="dropdown-menu">
                        <li>
                          <a draggable="false" tabIndex="-1" href="#" onClick={ this.archiveOptionClicked } >
                            <span>{ this.props.tab.deleted? "Restore" : "Move" }</span>
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
                )
              }
            </div>) :
            (<div className="tab-loader"><img src="<%= url('img/loader-small.gif') %>" alt="Loading" /></div>)
        }
      </div>
    );
  }
});

module.exports = TabComponent
