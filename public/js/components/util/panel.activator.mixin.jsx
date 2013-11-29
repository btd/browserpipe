/** @jsx React.DOM */

var PanelActivatorMixin = {
  handlePanelClick: function(handler) {
  	var self = this;
  	return function(e) {
		  	var proceedWithClick = true;		  	
		    if(self.props.activatePanel)
		        //If panel was not switched, we proceed with the click
		        proceedWithClick = !self.props.activatePanel();
		    if(proceedWithClick && handler)
		    	handler(e);
		}
	}
};

module.exports = PanelActivatorMixin