/**
 * @jsx React.DOM
 */

var _state = require('models/state')
    _ = require('lodash'),
    util = require('util'),
    React = require('React'),
    Item = require('components/built/center/item'),
    Folder = require('components/built/center/folder');

var ContainerView = React.createClass({displayName: 'ContainerView', 
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
			return React.DOM.span( {className:"tabs-count"},  this.props.container.items.length + " Tabs" )
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
			React.DOM.div(null, 
				 this.props.container.type === 2 ? this.renderFolderHeader() : null, 
				React.DOM.i( {onClick:this.closeContainer, className:"icon-remove close-container", title:"Close"}),
				React.DOM.span( {className:"title"}, 
					LabelEditorComponent( 
	                    {onSaveLabel:this.saveContainerLabel, 
	                    defaultLabelValue:this.getContainerTitle()} )
				),
				 this.getTabsCount() 
			)
		);
	},
	renderFolderHeader: function() {
		return (
			React.DOM.span(null, 
				React.DOM.a( {href:"#", onClick:this.showAndFocusAddFolderInput, className:"add-folder-icon"}, " Add folder"),
				 _state.getFolderFilter(this.props.container.folderObj) !== 'Folders'? 
				React.DOM.i( {onClick:this.navigateToParentFolder, className:"icon-arrow-up container-folder-icon", title:"Navigate folders up"}) : null 
			)
		);
	},
	renderBox: function() {
		return (
			React.DOM.div( {className:"box", style:{ maxHeight: this.getBoxMaxHeight() }}, 
				 this.props.container.type === 2 ? this.renderFolders() : null, 
            	 this.renderItems() 
			)
		);
	},
	renderItems: function() {		
		var items = (this.props.container.type === 2 ? this.props.container.folderObj.items: this.props.container.items);
		return (
			React.DOM.ul( {className:"items"}, 
			                    
                items.map(function(item) {
                    return Item( {item:item} )
                })
            
			)
		);
	},
	renderFolders: function() {
		var self = this;
		return (
			React.DOM.div(null, 
				React.DOM.ul( {className:"folders"}, 	
					                    
	                	this.props.container.folderObj.children.map(function(folder) {
		                    return Folder( {folder:folder, navigateToChildFolder:self.navigateToChildFolder} )
		                })
		            
				),
				React.DOM.div( {ref:"folderEditor", className:"input-append add-folder hide"}, 
					React.DOM.div( {className:"control-group"},     
				    	React.DOM.div( {className:"controls"}, 
							React.DOM.input( {ref:"folderInput", type:"text"}),
							React.DOM.div(null, 
							  	React.DOM.button( {onClick:this.saveFolder, className:"btn add-folder-save", type:"button"}, React.DOM.i( {className:"icon-ok save-icon"}, " Add folder")),
							  	React.DOM.button( {onClick:this.hideFolderInput, className:"btn add-folder-cancel", type:"button"}, React.DOM.i( {className:"icon-remove cancel-icon"}))
							)
						)
					)
				)
			)
		);
	},
	renderFooter: function() {
		return (
			React.DOM.div(null, 
				React.DOM.div( {ref:"itemEditor", className:"input-append add-item hide"}, 
					React.DOM.div( {className:"control-group"},     
				      React.DOM.div( {className:"controls"}, 
						  React.DOM.textarea( {ref:"itemInput", className:"item-url", cols:"2"}),
						  React.DOM.div(null, 
						  	React.DOM.span( {ref:"itemURLBlankError", className:"help-inline hide item-url-blank"}, "Cannot be blank"),
						  	React.DOM.span( {ref:"itemURLInvalidError", className:"help-inline hide item-url-invalid"}, "Invalid URL")
						  ),
						  React.DOM.div(null, 
						  	React.DOM.button( {onClick:this.saveItem, className:"btn add-item-save", type:"button"}, React.DOM.i( {className:"icon-ok save-icon"}, " Add URL")),
						  	React.DOM.button( {onClick:this.hideItemInput, className:"btn add-item-cancel", type:"button"}, React.DOM.i( {className:"icon-remove cancel-icon"}))
						)
					)
				  )
				),
				React.DOM.a( {onClick:this.showAndFocusAddItemInput, className:"opt-add-item"}, "Add URL")			
			)
		);
	},
	render: function() {
		return (
			React.DOM.li( {className:"container"}, 
				React.DOM.div( {className:"container-header"},  this.renderHeader() ),				
				 this.renderBox(), 
				React.DOM.div( {className:"container-footer"},  this.renderFooter() )
			)
		);
	}

});

module.exports = ContainerView
