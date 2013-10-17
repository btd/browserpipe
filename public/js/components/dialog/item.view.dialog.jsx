
/**
 * @jsx React.DOM
 */

var _state = require('../../state'),
	React = require('react'),
    page = require('page'),
	LabelEditorComponent = require('../util/label.editor');

var DialogItemView = React.createClass({
  getScreenshot: function() {
    return this.props.item.screenshot || "/img/default.screenshot.png";
  },
  saveItemTitle: function(newTitle, success) {    
     _state.serverUpdateItem(
  	   {
  	     _id: this.props.item._id,
  	     title: newTitle
  	   },
  	   success 
     );
  },
  saveItemNote: function(newNote, success) {    
     _state.serverUpdateItem(
  	   {
  	     _id: this.props.item._id,
  	     note: newNote
  	   },
  	   success 
     );
  },
  stopPropagation: function(e) {
    e.stopPropagation();      
  },
  closeDialogClick: function(e) {
    page('/listboard/' + this.props.selectedListboard._id);        
  },
  render: function() {
    return (
    		<div onClick={this.stopPropagation} class="modal-view-item modal">
	        	<div class="modal-header">
	        		<button onClick={this.closeDialogClick} type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
					<h4>
						<img class="favicon" src={ this.props.item.favicon } alt="Favicon" /> 						
						<span class="edit-item-title">
							<LabelEditorComponent 
			                    onSaveLabel= {this.saveItemTitle} 
			                    labelValue= { this.props.item.title? this.props.item.title : this.props.item.url } />
						</span>
						<div> 
							<a target="_blank" href={  decodeURIComponent(this.props.item.url)  }>{ decodeURIComponent(this.props.item.url) }</a>
						</div>
					</h4>
				</div>
				<div class="modal-body">
					<ul class="nav nav-tabs"> 
						<li><a href="#lists" data-toggle="tab">Lists</a></li>
						<li><a href="#general" data-toggle="tab">General</a></li> 
					</ul>
					<div class="tab-content">
						<div class="tab-pane active" id="general"> 
							<div class="item-screenshot-container">
								<img class="item-screenshot img-polaroid" data-src="holder.js/300x200" alt="300x200" src={ this.getScreenshot() } /> 							
							</div>
							<span class="edit-item-note">
								<LabelEditorComponent 
				                    onSaveLabel= {this.saveItemNote} 
				                    labelValue= { this.props.item.note }
				                    defaultLabelValue= "Add note" />
							</span>								
						</div>
						<div class="tab-pane" id="lists">
							<div class="item-lists"></div>
						</div>
					</div>
				</div>
			</div>
    );
  }
});

module.exports = DialogItemView