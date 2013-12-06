/** @jsx React.DOM */

var _ = require('lodash');

var PanelActivatorMixin = {
  handlePanelClick: function(handler) {
  	var self = this;
  	//TODO: this may be possible be done better connecting to react events listener
  	return function(e) {		  	
		    if(self.props.activatePanel)		        
		        self.props.activatePanel();
		    if(handler)
		    	handler(e);
		}
	}
};

module.exports = PanelActivatorMixin