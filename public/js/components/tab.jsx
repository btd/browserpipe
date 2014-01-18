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
      <div ref="tab" className="tab" >
        <div className="tab-mask" onClick={ this.tabMaskClicked } >
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
        <div className="tab-content">
	  <img src={this.props.tab.screenshot} />
	</div>
      </div>
    );
  }
});  

module.exports = TabComponent 
