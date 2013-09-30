
/**
 * @jsx React.DOM
 */

var React = require('react');

var DialogItemView = React.createClass({
  render: function() {
    return (
    		<div class="modal-view-item modal">
	        	<div class="modal-header">
	        		<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
					<h4>
						<img class="favicon" src={ this.props.item.favicon } alt="Favicon" /> 
						<span class="edit-bkmrk-title">{ this.props.item.title }</span> 						
						<div> 
							<a target="_blank" href={ this.props.item.url}>{ this.props.item.url }</a>
						</div>
					</h4>
				</div>
				<div class="modal-body">
					<ul class="nav nav-tabs"> 
						<li><a href="#delete" data-toggle="tab">Delete</a></li>
						<li><a href="#lists" data-toggle="tab">Lists</a></li>
						<li><a href="#general" data-toggle="tab">General</a></li> 
					</ul>
					<div class="tab-content">
						<div class="tab-pane active" id="general"> 
							<img class="item-screenshot img-polaroid" data-src="holder.js/300x200" alt="300x200" src="/img/default.screenshot.png" /> 
							<p class="bkmrk-note-content">{ this.props.item.note }</p> 
							<span class="edit-bkmrk-note">Edit note</span>										
						</div>
						<div class="tab-pane" id="lists">
							<div class="bkmrk-lists"></div>
						</div>
						<div class="tab-pane" id="delete">
							<div class="move-to-trash-alert alert alert-block">
								<p>Are you sure that you want to move the bookmark to trash?</p>
								<a class="opt-move-to-trash-yes" href="#">Yes, move it!</a>
							</div>
						</div>
					</div>
				</div>
			</div>
    );
  }
});

module.exports = DialogItemView