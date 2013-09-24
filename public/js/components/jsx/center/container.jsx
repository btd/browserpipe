/**
 * @jsx React.DOM
 */

var _state = require('models/state')
    _ = require('lodash'),
    util = require('util'),
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
	closeContainer: function() {
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
	//Create folder
	showAndFocusAddFolderInput: function() {      		
		this.refs.folderEditor.getDOMNode().className = "input-append add-folder";   
		this.refs.folderInput.getDOMNode().value = "";
		this.refs.folderInput.getDOMNode().focus(); 
	},
	hideFolderInput: function() {
		this.refs.folderEditor.getDOMNode().className = "input-append add-folder hide";
	},
	saveFolder: function() {    
		var self = this;
		var label = $.trim(this.refs.folderInput.getDOMNode().value)
		var path = _state.getFolderFilter(this.props.container.folderObj);

		if(label != '')
			_state.serverSaveFolder({
				label: label,
				path: path
			}, function(){
				self.hideFolderInput();
			});
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
		var folders = [];
		if(this.props.container.type === 2)
			folders.push(this.props.container.folder)
		else
			containers.push(this.props.container._id)
		var url = $.trim(this.refs.itemInput.getDOMNode().value)
		var errorElements = this.validateFields(url);
		if (errorElements.length === 0)
			_state.serverSaveItem({				
				type: 0,
				url: url,
				containers: containers,
				folders: folders
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
	renderHeader: function() {
		return (
			<div>
				{ this.props.container.type === 2 ? this.renderFolderHeader() : null }
				<i onClick={this.closeContainer} class="icon-remove close-container" title="Close"></i>
				<span class="title">
					<LabelEditorComponent 
	                    onSaveLabel= {this.saveContainerLabel} 
	                    defaultLabelValue= {this.getContainerTitle()} />
				</span>
				{ this.getTabsCount() }
			</div>
		);
	},
	renderFolderHeader: function() {
		return (
			<span>
				<a href="#" onClick={this.showAndFocusAddFolderInput} class="add-folder-icon">&nbsp;Add folder</a>
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
		var items = (this.props.container.type === 2 ? this.props.container.folderObj.items: this.props.container.items);
		return (
			<ul class="items">
			{                    
                items.map(function(item) {
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
				<div ref="folderEditor" class="input-append add-folder hide">
					<div class="control-group">    
				    	<div class="controls">
							<input ref="folderInput" type="text"/>
							<div>
							  	<button onClick={this.saveFolder} class="btn add-folder-save" type="button"><i class="icon-ok save-icon">&nbsp;Add folder</i></button>
							  	<button onClick={this.hideFolderInput} class="btn add-folder-cancel" type="button"><i class="icon-remove cancel-icon"></i></button>
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
				<div ref="itemEditor" class="input-append add-item hide">
					<div class="control-group">    
				      <div class="controls">
						  <textarea ref="itemInput" class="item-url" cols="2"></textarea>
						  <div>
						  	<span ref="itemURLBlankError" class="help-inline hide item-url-blank">Cannot be blank</span>
						  	<span ref="itemURLInvalidError" class="help-inline hide item-url-invalid">Invalid URL</span>
						  </div>
						  <div>
						  	<button onClick={this.saveItem} class="btn add-item-save" type="button"><i class="icon-ok save-icon">&nbsp;Add URL</i></button>
						  	<button onClick={this.hideItemInput} class="btn add-item-cancel" type="button"><i class="icon-remove cancel-icon"></i></button>
						</div>
					</div>
				  </div>
				</div>
				<a onClick={this.showAndFocusAddItemInput} class="opt-add-item">Add URL</a>			
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
