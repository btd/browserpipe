/** @jsx React.DOM */

var React = require('react');

var PanelMixin = {
	getPinClassName: function() {
		return 'icon-pushpin' + 
			(this.props.panelPinnedNumber === this.props.panelNumber ? ' pinned' : '');
	},
  	getPanelPin: function() {
  		return <li>
          <a href="#" title="Pin panel">
            <i 
              className= { this.getPinClassName() }
              onClick= { this.handlePanelClick(this.props.pinPanelToggle) }
            ></i>
          </a>
        </li>
	}
};

module.exports = PanelMixin