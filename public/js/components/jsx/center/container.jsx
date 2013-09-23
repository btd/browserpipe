/**
 * @jsx React.DOM
 */

var _state = require('models/state')
    _ = require('lodash'),
    React = require('React'),
    Item = require('components/built/center/item'),
    Folder = require('components/built/center/folder');

var ContainerView = React.createClass({ 
	getContainerTitle: function() {		
		if(this.props.container.type === 2) 
			return this.props.container.folderObj.label;
		else if(!this.props.container.title || $.trim(this.props.container.title) === '')			
			if(this.props.container.type === 0) 
				return this.props.container.items.length + " Tabs";
			else
				return 'Unnamed'
		else
			return this.props.container.title;
	},
	getTabsCount: function() {
		 if(this.props.container.type === 0 && $.trim(this.props.container.title) === '')
			return <span class="tabs-count">{ this.props.container.items.length + " Tabs" }</span>
		else
			return null;
	},
	getBoxMaxHeight: function() {
		var maxHeight = this.props.containersHeight - 26 - 60 ; //(26 = cont header height)(60 =  cont footer height)    
	    return maxHeight;
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
	navigateToParentFolder: function() {
		var parent = _state.getFolderByFilter(this.props.container.folderObj.path);
		_state.serverUpdateContainer(
		   	this.props.selectedListboard._id,
		   {
		     _id: this.props.container._id,
		     folder: parent._id
		   }
	   );
	},
	navigateToChildFolder: function(folderId) {
		var child = _state.getFolderById(folderId);
		_state.serverUpdateContainer(
		   	this.props.selectedListboard._id,
		   {
		     _id: this.props.container._id,
		     folder: child._id
		   }
	   );
	},
	renderHeader: function() {
		return (
			<div>
				{ this.props.container.type === 2 ? this.renderFolderHeader() : null }
				<i class="icon-remove close-container" title="Close"></i>
				<span class="title">
					<LabelEditorComponent 
	                    onSaveLabel= {this.saveContainerLabel} 
	                    defaultLabelValue= {this.getContainerTitle()} />
				</span>
				{ this.getTabsCount() }
				<div class="input-append edit-title hide">
				  <input type="text" value={this.props.container.title} />
				  <button class="btn edit-title-save" type="button"><i class="icon-ok"></i></button>
				  <button class="btn edit-title-cancel" type="button"><i class="icon-remove"></i></button>
				</div>
			</div>
		);
	},
	renderFolderHeader: function() {
		return (
			<span>
				<a href="#" class="add-folder-icon">&nbsp;Add folder</a>
				{ _state.getFolderFilter(this.props.container.folderObj) !== 'Folders'? 
				<i onClick={this.navigateToParentFolder} class="icon-arrow-up container-folder-icon" title="Navigate folders up"></i> : null }
			</span>
		);
	},
	renderBox: function() {
		return (
			<div class="box" style={{ maxHeight: this.getBoxMaxHeight() }}>
				{ this.props.container.type === 2 ? this.renderFolders() : null }
            	{ this.renderItems() }
			</div>
		);
	},
	renderItems: function() {
		return (
			<ul class="items">
			{                    
                this.props.container.items.map(function(item) {
                    return <Item item= {item} />
                })
            }
			</ul>
		);
	},
	renderFolders: function() {
		var self = this;
		return (
			<div>
				<ul class="folders">	
					{                    
	                	this.props.container.folderObj.children.map(function(folder) {
		                    return <Folder folder= {folder} navigateToChildFolder= {self.navigateToChildFolder} />
		                })
		            }
				</ul>
				<div class="input-append add-folder hide">
					<div class="control-group">    
				    	<div class="controls">
							<input type="text" value=""/>
							<div>
							  	<button class="btn add-folder-save" type="button"><i class="icon-ok save-icon">&nbsp;Add folder</i></button>
							  	<button class="btn add-folder-cancel" type="button"><i class="icon-remove cancel-icon"></i></button>
							</div>
						</div>
					</div>
				</div>
			</div>
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
				{ this.renderBox() }
				<div class="container-footer">{ this.renderFooter() }</div>
			</li>
		);
	}

});

module.exports = ContainerView
