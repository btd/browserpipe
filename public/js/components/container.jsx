/**
 * @jsx React.DOM
 */

var _state = require('../state'),
    _ = require('lodash'),
    $ = require('jquery'),
    page = require('page'),
    React = require('react');

var ContainerComponent = React.createClass({ 
  containerClicked: function() {
    page('/item/' + this.props.container._id); 
  },
  closeOptionClicked: function(e) {
    e.stopPropagation();
    _state.serverDeleteItem(this.props.container, function(){
      page('/');
    });
  },
  editOptionClicked: function(e) {
    e.stopPropagation();
    this.refs.containerInner.getDOMNode().className = "hide";
    this.refs.containerCloseOption.getDOMNode().className = "hide";
    this.refs.containerEditOption.getDOMNode().className = "hide";
    this.refs.containerTitleEditor.getDOMNode().className = "";
    this.refs.titleInput.getDOMNode().value = (this.props.container.title? this.props.container.title : '') ;
    this.refs.titleInput.getDOMNode().focus(); 
  },
  saveContainerTitle: function() {    
    var self = this;
    _state.serverUpdateItem({
      _id: this.props.container._id,
      title: this.refs.titleInput.getDOMNode().value
    }, function() {
      self.hideInput();
    });
  },
  ifEnterSave: function(e) {
    if(e.keyCode === 13) this.saveContainerTitle();
  },
  hideInput: function() {
    this.refs.containerInner.getDOMNode().className = "container-inner";
    this.refs.containerCloseOption.getDOMNode().className = "close-option fa fa-times";
    this.refs.containerEditOption.getDOMNode().className = "edit-option fa fa-pencil";
    this.refs.containerTitleEditor.getDOMNode().className = "hide";
  },
  renderTitleEditor: function() {
    return ( 
      <div className="title-editor" >
	<input ref="titleInput" type="text" defaultValue={this.props.container.title} onKeyPress={this.ifEnterSave} />
	<button onClick={ this.saveContainerTitle } className="btn edit-title-save" type="button"><i className="fa fa-check"></i></button>
	<button onClick={ this.hideInput } className="btn edit-title-cancel" type="button"><i className="fa fa-times"></i></button>
      </div>
    );
  },
  renderItemScreenshots: function() {
    var self = this;
    return  this.props.container.items.map(function(tabId){
      var tab = _state.getItemById(tabId);
      return  <img className="tab-screenshot-small" src={ tab.screenshot } />
    })
  },
  renderItemTitle: function() {
    return <div className="container-title">{ this.props.container.title }</div>
  },
  render: function() {
    return (
      <div onClick={ this.containerClicked } className={"container" + (this.props.active?" active":"")} >
	<i ref="containerCloseOption" onClick={ this.closeOptionClicked } className="close-option fa fa-times"></i>
	<i ref="containerEditOption" onClick={ this.editOptionClicked } className="edit-option fa fa-pencil"></i>
	<div ref="containerInner" className="container-inner" >
	{ 
	  (this.props.container.title && this.props.container.title !== '')?
	    this.renderItemTitle() : 
	    this.renderItemScreenshots() 
	}
	</div>
	<div ref="containerTitleEditor" className="hide" > 
	{ this.renderTitleEditor() }
	</div>
      </div>
    );
  },
});  

module.exports = ContainerComponent 
