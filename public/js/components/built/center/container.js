/**
 * @jsx React.DOM
 */

var _state = require('models/state')
    _ = require('lodash'),
    React = require('React'),
    Item = require('components/built/center/item');

var ContainerView = React.createClass({displayName: 'ContainerView', 
	getContainerTitle: function() {
		if($.trim(this.props.container.get('title')) === '')
			if(this.props.container.get('type')===0) 
				return this.props.container.getItems().length + " Tabs";
			else
				return React.DOM.i(null, "Unnamed")
		else
			return this.props.container.get('title');
	},
	getTabsCount: function() {
		 if(this.props.container.get('type')===0 && $.trim(this.props.container.get('title')) === '')
			return React.DOM.span( {className:"tabs-count"},  this.props.container.getItems().length + " Tabs" )
		else
			return null;
	},
	getBoxMaxHeight: function() {
		var maxHeight = this.props.containersHeight - 26 - 60 ; //(26 = cont header height)(60 =  cont footer height)    
	    return maxHeight;
	},
	renderHeader: function() {
		return (
			React.DOM.div(null, 
				React.DOM.i( {className:"icon-remove close-container", title:"Close"}),
				React.DOM.span( {className:"title"},  this.getContainerTitle()  ),
				 this.getTabsCount(), 
				React.DOM.div( {className:"input-append edit-title hide"}, 
				  React.DOM.input( {type:"text", value:this.props.container.get('title')} ),
				  React.DOM.button( {className:"btn edit-title-save", type:"button"}, React.DOM.i( {className:"icon-ok"})),
				  React.DOM.button( {className:"btn edit-title-cancel", type:"button"}, React.DOM.i( {className:"icon-remove"}))
				)
			)
		);
	},
	renderBox: function() {
		return (
			React.DOM.ul( {className:"items"}, 
			                    
                this.props.container.getItems().map(function(item) {
                    return Item( {item:item} )
                })
            
			)
		);
	},
	renderFooter: function() {
		return (
			React.DOM.div(null, 
				React.DOM.div( {className:"input-append add-item hide"}, 
					React.DOM.div( {className:"control-group"},     
				      React.DOM.div( {className:"controls"}, 
						  React.DOM.textarea( {className:"item-url", cols:"2"}),
						  React.DOM.div(null, 
						  	React.DOM.span( {className:"help-inline hide item-url-blank"}, "Cannot be blank"),
						  	React.DOM.span( {className:"help-inline hide item-url-invalid"}, "Invalid URL")
						  ),
						  React.DOM.div(null, 
						  	React.DOM.button( {className:"btn add-item-save", type:"button"}, React.DOM.i( {className:"icon-ok save-icon"}, " Add URL")),
						  	React.DOM.button( {className:"btn add-item-cancel", type:"button"}, React.DOM.i( {className:"icon-remove cancel-icon"}))
						)
					)
				  )
				),
				React.DOM.a( {className:"opt-add-item"}, "Add URL")			
			)
		);
	},
	render: function() {
		return (
			React.DOM.li( {className:"container"}, 
				React.DOM.div( {className:"container-header"},  this.renderHeader() ),
				React.DOM.div( {className:"box", style:{ maxHeight: this.getBoxMaxHeight() }}, 
					 this.renderBox() 
				),
				React.DOM.div( {className:"container-footer"},  this.renderFooter() )
			)
		);
	}

});

module.exports = ContainerView
