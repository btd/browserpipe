
/**
 * @jsx React.DOM
 */

var _state = require('../../state'),
	React = require('react'),
    page = require('page'),
	LabelEditorComponent = require('../util/label.editor');

var DialogItemComponent = React.createClass({
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
    		<div onClick={this.stopPropagation} className="modal-view-item modal">
	        	<div className="modal-header">
	        		<button onClick={this.closeDialogClick} type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
					<h4>
						<img className="favicon" src={ this.props.item.favicon } alt="Favicon" /> 						
						<span className="edit-item-title">
							<LabelEditorComponent 
			                    onSaveLabel= {this.saveItemTitle} 
			                    labelValue= { this.props.item.title? this.props.item.title : this.props.item.url } />
						</span>
						<div> 
							<a target="_blank" href={  decodeURIComponent(this.props.item.url)  }>{ decodeURIComponent(this.props.item.url) }</a>
						</div>
					</h4>
				</div>
				<div className="modal-body">
					<ul className="nav nav-tabs"> 
						<li><a href="#lists" data-toggle="tab">Lists</a></li>
						<li><a href="#general" data-toggle="tab">General</a></li> 
					</ul>
					<div className="tab-content">
						<div className="tab-pane active" id="general"> 
							<div className="item-screenshot-container">
								<img className="item-screenshot img-polaroid" data-src="holder.js/300x200" alt="300x200" src={ this.getScreenshot() } /> 							
							</div>
							<span className="edit-item-note">
								<LabelEditorComponent 
				                    onSaveLabel= {this.saveItemNote} 
				                    labelValue= { this.props.item.note }
				                    defaultLabelValue= "Add note" />
							</span>								
						</div>
						<div className="tab-pane" id="lists">
							<div className="item-lists"></div>
						</div>
					</div>
				</div>
			</div>
    );
  }
});

module.exports = DialogItemComponent