/**
 * @jsx React.DOM
 */

var _state = require('../../state'),
    _ = require('lodash'),
    extension = require('../../extension/extension'),
    util = require('../../util'),
    React = require('react'),
    Item = require('./item'),    
    LabelEditorComponent = require('../util/label.editor'),
    itemDraggable = require('../../dragging/item'),
    selection = require('../../selection/selection');   

var ContainerComponent = React.createClass({ 
	getContainerTitle: function() {		
		if(!this.props.container.title || this.props.container.title.trim() === '')			
			if(this.props.container.type === 0) 
				return this.props.container.items.length + " Tabs";
			else
				return null
		else
			return this.props.container.title;
	},
	getTabsCount: function() {
		 if(this.props.container.type === 0 && (!this.props.container.title || this.props.container.title.trim() === ''))
			return <span className="tabs-count">{ this.props.container.items.length + " Tabs" }</span>
		else
			return null;
	},
	getBoxMaxHeight: function() {
		//TODO: scrollbar should be floating to not bother height change
		var maxHeight = this.props.containersHeight - 4 - 24 - 36 - 21 - 18 ; //(4 = container border) (24 = 12 + 12 = container margin and padding) (36 = cont header height) (21 =  cont footer height) (18 = horizontal scrollbar)   		
	    return maxHeight;
	},
	closeContainer: function(e) {		
    	e.stopPropagation();    	
    	if(this.props.container.type === 0)
    		extension.closeTabs([this.props.container.externalId]);
    	else
			_state.serverRemoveContainer(this.props.selectedListboard._id, this.props.container);
	},
	saveContainerLabel: function(newTitle, success) {    
	   _state.serverUpdateContainer(
		   	this.props.selectedListboard._id,
		   {
		     _id: this.props.container._id,
		     title: newTitle
		   },
		   success 
	   );
	},	
	//Create item
	showAndFocusAddItemInput: function() {      		
		this.refs.itemEditor.getDOMNode().className = "input-append add-item";   
		this.refs.itemInput.getDOMNode().value = "";
		this.refs.itemInput.getDOMNode().focus(); 
	},
	hideItemInput: function() {
		this.refs.itemEditor.getDOMNode().className = "input-append add-item hide";
		this.refs.itemURLBlankError.getDOMNode().className = "help-inline hide item-url-blank";
		this.refs.itemURLInvalidError.getDOMNode().className = "help-inline hide item-url-invalid";
	},
	saveItem: function() {    
		var self = this;
		var containers = [];		
		containers.push(this.props.container._id)
		var url = this.refs.itemInput.getDOMNode().value.trim();
		var errorElements = this.validateFields(url);
		if (errorElements.length === 0)
			_state.serverSaveItem({				
				type: 0,
				url: url,
				containers: containers
			}, function(){
				self.hideItemInput();
			});
		else {
			errorElements.map(function(errorElement){
				errorElement.getDOMNode().className = errorElement.getDOMNode().className.replace('hide', '');
			})
		}
	},
    validateFields: function (url) {
    	var errors = [];
        if (url === '')
            errors.push(this.refs.itemURLBlankError);
        else if (!util.isValidURL(url))
        	errors.push(this.refs.itemURLInvalidError)
        return errors
    },
    isSelected: function() {
    	return this.props.forceSelected || selection.isContainerSelected(this.props.container._id);
    },
    containerClicked: function(e) {
		e.preventDefault();
    	e.stopPropagation();
    	if(e.ctrlKey){
    		if(!this.isSelected())
				selection.selectContainer(this.props.container._id);
			else
				selection.unSelectContainer(this.props.container._id);
    	}
	},
    getItemId : function() {
		return "co-" + this.props.container._id;
	},
	getContainerClass: function() {
		return "container " + 
				(this.isSelected()? selection.getClassName() : '');
	},
	renderHeader: function() {
		return (
			<div>				
				<i onClick={this.closeContainer} className="icon-remove close-container" title="Close"></i>
				{					
					<span className="title">
						<LabelEditorComponent 
	                    	onSaveLabel= {this.saveContainerLabel} 
	                    	labelValue= {this.getContainerTitle()}
	                    	defaultLabelValue= "Unnamed" />
					</span>
				}				
				{ this.getTabsCount() }
			</div>
		);
	},	
	renderBox: function() {
		return (
			<div className="box" style={{ maxHeight: this.getBoxMaxHeight() }}>				
            	{ this.renderItems() }
            	<div ref="itemEditor" className="input-append add-item hide">
					<div className="control-group">    
				      <div className="controls">
						  <textarea ref="itemInput" className="item-url" cols="2"></textarea>
						  <div>
						  	<span ref="itemURLBlankError" className="help-inline hide item-url-blank">Cannot be blank</span>
						  	<span ref="itemURLInvalidError" className="help-inline hide item-url-invalid">Invalid URL</span>
						  </div>
						  <div>
						  	<button onClick={this.saveItem} className="btn add-item-save" type="button"><i className="icon-ok save-icon">&nbsp;Add URL</i></button>
						  	<button onClick={this.hideItemInput} className="btn add-item-cancel" type="button"><i className="icon-remove cancel-icon"></i></button>
						</div>
					</div>
				  </div>
				</div>
			</div>
		);
	},
	renderItems: function() {	
		var forceSelected = this.props.forceSelected || selection.isContainerSelected(this.props.container._id);			
		return (
			<ul className="items"
				onDragOver={itemDraggable.parentDragOver}
                onEnter={itemDraggable.parentDragEnter}
                onDragLeave={itemDraggable.parentDragLeave}
                onDrop={itemDraggable.parentDrop}
			>
			{                    
                this.props.container.items.map(function(item) {
                    return <Item 
            			item= {item} 
            			itemDraggable={itemDraggable} 
            			forceSelected={forceSelected} />
                })
            }
			</ul>
		);
	},
	renderFooter: function() {
		return (
			<div className="container-footer">				
				<a draggable="false" onClick={this.showAndFocusAddItemInput} className="opt-add-item">Add URL</a>			
			</div>
		);
	},
	render: function() {
		return (
			<li ref="container" 
				id={ this.getItemId() } 
				className={this.getContainerClass()}
				onClick={this.containerClicked}
				draggable="true" 
				onDragStart={this.props.containerDraggable.objDragStart} 
				onDragEnd={this.props.containerDraggable.objDragEnd}
				onDragOver={this.props.containerDraggable.objDragOver}
				onDragEnter={this.props.containerDraggable.objDragEnter}
				onDragLeave={this.props.containerDraggable.objDragLeave}
				onDrop={this.props.containerDraggable.objDrop}>
				<div className="container-header">{ this.renderHeader() }</div>				
				{ this.renderBox() }
				{ this.renderFooter() }
			</li>
		);
	}

});

module.exports = ContainerComponent
