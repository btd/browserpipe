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
  render: function() {
    return (
      <div ref="tab" className={"tab" + (this.props.active? " maximized" : (this.props.browserMode? " hide" : " minimized"))} >
        <div className={ "tab-mask" + (this.props.active? " hide" : "")} onClick={ this.tabMaskClicked } >
          <div className="tab-mask-options">
            <div className="tab-mask-option">
              <i className="icon-share"></i>
            </div>
            <div className="tab-mask-option">
              <i className="icon-share"></i>
            </div>
          </div>
          <div className="tab-mask-text" >Click to open</div>
        </div>
        <iframe src='about:blank' className="tab-content">
	</iframe>
      </div>
    );
  },
  componentDidMount: function() {
    var $tabContent = $('.tab-content', this.refs.tab.getDOMNode());
    $tabContent.contents().find('body').append(this.props.tab.html);
  } 
});  

module.exports = TabComponent 
