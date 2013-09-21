/**
 * @jsx React.DOM
 */

var _state = require('models/state')
    _ = require('lodash'),
    React = require('React'),
    Item = require('components/built/center/item');

var ContainerView = React.createClass({ 
	getContainerTitle: function() {
		if($.trim(this.props.container.get('title')) === '')
			if(this.props.container.get('type')===0) 
				return this.props.container.getItems().length + " Tabs";
			else
				return <i>Unnamed</i>
		else
			return this.props.container.get('title');
	},
	getTabsCount: function() {
		 if(this.props.container.get('type')===0 && $.trim(this.props.container.get('title')) === '')
			return <span class="tabs-count">{ this.props.container.getItems().length + " Tabs" }</span>
		else
			return null;
	},
	getBoxMaxHeight: function() {
		var maxHeight = this.props.containersHeight - 26 - 60 ; //(26 = cont header height)(60 =  cont footer height)    
	    return maxHeight;
	},
	renderHeader: function() {
		return (
			<div>
				<i class="icon-remove close-container" title="Close"></i>
				<span class="title">{ this.getContainerTitle() } </span>
				{ this.getTabsCount() }
				<div class="input-append edit-title hide">
				  <input type="text" value={this.props.container.get('title')} />
				  <button class="btn edit-title-save" type="button"><i class="icon-ok"></i></button>
				  <button class="btn edit-title-cancel" type="button"><i class="icon-remove"></i></button>
				</div>
			</div>
		);
	},
	renderBox: function() {
		return (
			<ul class="items">
			{                    
                this.props.container.getItems().map(function(item) {
                    return <Item item= {item} />
                })
            }
			</ul>
		);
	},
	renderFooter: function() {
		return (
			<div>
				<div class="input-append add-item hide">
					<div class="control-group">    
				      <div class="controls">
						  <textarea class="item-url" cols="2"></textarea>
						  <div>
						  	<span class="help-inline hide item-url-blank">Cannot be blank</span>
						  	<span class="help-inline hide item-url-invalid">Invalid URL</span>
						  </div>
						  <div>
						  	<button class="btn add-item-save" type="button"><i class="icon-ok save-icon">&nbsp;Add URL</i></button>
						  	<button class="btn add-item-cancel" type="button"><i class="icon-remove cancel-icon"></i></button>
						</div>
					</div>
				  </div>
				</div>
				<a class="opt-add-item">Add URL</a>			
			</div>
		);
	},
	render: function() {
		return (
			<li class="container">
				<div class="container-header">{ this.renderHeader() }</div>
				<div class="box" style={{ maxHeight: this.getBoxMaxHeight() }}>
					{ this.renderBox() }
				</div>
				<div class="container-footer">{ this.renderFooter() }</div>
			</li>
		);
	}

});

module.exports = ContainerView
