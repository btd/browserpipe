/**
 * @jsx React.DOM
 */

var $ = require('jquery'),
    _state = require('../../state'),
    util = require('../../util'),
    _ = require('lodash'),
    React = require('react'),
    Folder = require('./folder'), 
    Item = require('./item'),    
    LabelEditorComponent = require('../util/label.editor');

var FolderPanelComponent = React.createClass({  
	getBoxHeight: function() {
		var height = this.props.folderPanelHeight - 36 - 30 ; //(36 = folder header height) (30 =  cont footer height)    		
	    return height;
	},
	navigateToParentFolder: function() {		
		var parent = _state.getFolderByFilter(this.props.folder.path);
		_state.setSelectedFolder(parent._id);
	},
	navigateToChildFolder: function(folderId) {
		_state.setSelectedFolder(folderId);
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
	saveFolderLabel: function(newLabel, success) {    
	   _state.serverUpdateFolder(
		   {
		     _id: this.props.folder._id,
		     label: newLabel
		   },
		   success 
	   );
	},
	saveFolder: function() {    
		var self = this;
		var label = this.refs.folderInput.getDOMNode().value.trim()
		var path = this.props.folder.filter;

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
		var folders = [];		
		folders.push(this.props.folder._id)
		var url = this.refs.itemInput.getDOMNode().value.trim();
		var errorElements = this.validateFields(url);
		if (errorElements.length === 0)
			_state.serverSaveItem({				
				type: 0,
				url: url,
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
    		<div className="folder-panel-header">
    			<a href="#" onClick={this.showAndFocusAddFolderInput} className="add-folder-icon">&nbsp;Add folder</a>
				{ !this.props.folder.isRoot? <i onClick={this.navigateToParentFolder} className="icon-arrow-up folder-icon" title="Navigate folders up"></i> : null }
				<div className="folder-label">
					{	this.props.folder.isRoot? 
							this.props.folder.label : 
							<LabelEditorComponent 
		                    	onSaveLabel= {this.saveFolderLabel} 
		                    	labelValue= {this.props.folder.label} />
                    }
				</div>
    		</div>
    	);
    },
    renderBox: function() {
		return (
			<div className="box" style={{ height: this.getBoxHeight() }}>				
            	{ this.renderFolders() }
				{ this.renderItems() }
			</div>
		);
	},

	onEnterSaveFolder: function(e) {
	    if(e.keyCode === 13) this.saveFolder();
	},

	renderFolders: function() {		
		var self = this;
		return (
			<div>
				<ul className="folders">	
					{
	                	this.props.folder.children.map(function(folder) {
		                    return <Folder folder= {folder} navigateToChildFolder= {self.navigateToChildFolder} />
		                })
		            }
				</ul>
				<div ref="folderEditor" className="input-append add-folder hide">
					<div className="control-group">    
				    	<div className="controls">
							<input ref="folderInput" type="text" onKeyPress={this.onEnterSaveFolder}/>
							<div>
							  	<button onClick={this.saveFolder} className="btn add-folder-save" type="button"><i className="icon-ok save-icon">&nbsp;Add folder</i></button>
							  	<button onClick={this.hideFolderInput} className="btn add-folder-cancel" type="button"><i className="icon-remove cancel-icon"></i></button>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	},
	renderItems: function() {				
		return (
			<div>
				<ul className="items">
				{                    
	                this.props.folder.items.map(function(item) {
	                    return <Item item= {item} />
	                })
	            }
				</ul>
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
	renderFooter: function() {
		return (
			<div className="folder-panel-footer">				
				<a onClick={this.showAndFocusAddItemInput} className="opt-add-item">Add URL</a>			
			</div>
		);
	},
	render: function() {  
		return (
			<div className="folder-panel" style={{ height: this.props.folderPanelHeight }}>				
    			<a href="#" className="folder-panel-hide-btn">
    				<i className="icon-chevron-right"></i>
    			</a>
				{ this.renderHeader() }
				{ this.renderBox() }			
				{ this.renderFooter() }				
			</div>
		);
	}
});

module.exports = FolderPanelComponent
