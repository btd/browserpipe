/**
 * @jsx React.DOM
 */

var _state = require('models/state')
    _ = require('lodash'),
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
			React.DOM.div(null, 
				 this.props.container.type === 2 ? this.renderFolderHeader() : null, 
				React.DOM.i( {className:"icon-remove close-container", title:"Close"}),
				React.DOM.span( {className:"title"}, 
					LabelEditorComponent( 
	                    {onSaveLabel:this.saveContainerLabel, 
	                    defaultLabelValue:this.getContainerTitle()} )
				),
				 this.getTabsCount(), 
				React.DOM.div( {className:"input-append edit-title hide"}, 
				  React.DOM.input( {type:"text", value:this.props.container.title} ),
				  React.DOM.button( {className:"btn edit-title-save", type:"button"}, React.DOM.i( {className:"icon-ok"})),
				  React.DOM.button( {className:"btn edit-title-cancel", type:"button"}, React.DOM.i( {className:"icon-remove"}))
				)
			)
		);
	},
	renderFolderHeader: function() {
		return (
			React.DOM.span(null, 
				React.DOM.a( {href:"#", className:"add-folder-icon"}, " Add folder"),
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
		return (
			React.DOM.ul( {className:"items"}, 
			                    
                this.props.container.items.map(function(item) {
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
				React.DOM.div( {className:"input-append add-folder hide"}, 
					React.DOM.div( {className:"control-group"},     
				    	React.DOM.div( {className:"controls"}, 
							React.DOM.input( {type:"text", value:""}),
							React.DOM.div(null, 
							  	React.DOM.button( {className:"btn add-folder-save", type:"button"}, React.DOM.i( {className:"icon-ok save-icon"}, " Add folder")),
							  	React.DOM.button( {className:"btn add-folder-cancel", type:"button"}, React.DOM.i( {className:"icon-remove cancel-icon"}))
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
				 this.renderBox(), 
				React.DOM.div( {className:"container-footer"},  this.renderFooter() )
			)
		);
	}

});

module.exports = ContainerView
