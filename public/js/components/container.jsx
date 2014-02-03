/**
 * @jsx React.DOM
 */

var _state = require('../state'),
    _ = require('lodash'),
    $ = require('jquery'),
    page = require('page'),
    React = require('react');

var ContainerComponent = React.createClass({ 
  getInitialState: function() {
    return {
      container: (this.belongsToContainer(this.props.selected)? this.props.selected: this.props.container) 
    }
  },
  belongsToContainer: function(container) {
    //It is active when the container or on of its child is selected
    return container && (this.getParentRootId(container) === this.props.container._id);
  },
  isRootContainer: function(container) {
    return container.parent === _state.browser._id
  },
  getParentRootId: function(selected) {
    if(this.isRootContainer(selected)) return selected._id;
    else return this.getParentRootId(_state.getItemById(selected.parent));
  },
  containerClicked: function() {
    page('/item/' + this.state.container._id); 
  },
  rootOptionClicked: function(e) {
    e.stopPropagation();
    page('/item/' + this.props.container._id); 
  },
  closeOptionClicked: function(e) {
    e.stopPropagation();
    var parentId = this.isRootContainer(this.state.container)? null: this.state.container.parent;
    _state.serverDeleteItem(this.state.container, function(){
      if(parentId) page('/item/' + parentId); 
      else page('/');
    });
  },
  editOptionClicked: function(e) {
    e.stopPropagation();
    this.refs.containerInner.getDOMNode().className = "hide";
    if(this.refs.containerRootOption)
      this.refs.containerRootOption.getDOMNode().className = "hide";
    this.refs.containerCloseOption.getDOMNode().className = "hide";
    this.refs.containerEditOption.getDOMNode().className = "hide";
    this.refs.containerTitleEditor.getDOMNode().className = "";
    this.refs.titleInput.getDOMNode().value = (this.state.container.title? this.state.container.title : '') ;
    this.refs.titleInput.getDOMNode().focus(); 
  },
  saveContainerTitle: function(e) {    
    e.stopPropagation();
    var self = this;
    _state.serverUpdateItem({
      _id: this.state.container._id,
      title: this.refs.titleInput.getDOMNode().value
    }, function() {
      self.hideInput();
    });
  },
  ifEnterSave: function(e) {
    if(e.keyCode === 13) this.saveContainerTitle(e);
  },
  hideInput: function() {
    this.refs.containerInner.getDOMNode().className = "container-inner";
    if(this.refs.containerRootOption)
      this.refs.containerRootOption.getDOMNode().className = "root-option fa fa-home";
    this.refs.containerCloseOption.getDOMNode().className = "close-option fa fa-times";
    this.refs.containerEditOption.getDOMNode().className = "edit-option fa fa-pencil";
    this.refs.containerTitleEditor.getDOMNode().className = "hide";
  },
  renderTitleEditor: function() {
    return ( 
      <div className="title-editor" >
	<input ref="titleInput" type="text" defaultValue={this.state.container.title} onKeyPress={this.ifEnterSave} />
	<button onClick={ this.saveContainerTitle } className="btn edit-title-save" type="button"><i className="fa fa-check"></i></button>
	<button onClick={ this.hideInput } className="btn edit-title-cancel" type="button"><i className="fa fa-times"></i></button>
      </div>
    );
  },
  renderItemScreenshots: function() {
    var self = this;
    return  this.state.container.items.map(function(tabId){
      var tab = _state.getItemById(tabId);
      return  <img className="tab-screenshot-small" src={ tab.screenshot } />
    })
  },
  renderItemTitle: function() {
    var title = (this.state.container.title && this.state.container.title.trim() !== '')? this.state.container.title : "New folder";
    return <div className="container-title">
    { 
      (this.state.container.parent === _state.browser._id? title : ".../" + title) 
    }
    </div>
  },
  render: function() {
    return (
      <div title={ this.state.container.title } onClick={ this.containerClicked } className={"container" + (this.belongsToContainer(this.props.selected)?" active":"")} >
	{ 
	  !this.isRootContainer(this.state.container)?
	    <i ref="containerRootOption" onClick={ this.rootOptionClicked } className="root-option fa fa-home"></i>
	    : null
	}
	<i ref="containerCloseOption" onClick={ this.closeOptionClicked } className="close-option fa fa-times"></i>
	<i ref="containerEditOption" onClick={ this.editOptionClicked } className="edit-option fa fa-pencil"></i>
	<div ref="containerInner" className="container-inner" >
	{ 
	  (!this.isRootContainer(this.state.container) || (this.state.container.title && this.state.container.title.trim() !== ''))?
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
  componentWillReceiveProps: function(nextProps) {
    if(this.belongsToContainer(nextProps.selected)) 
      this.setState({
        container: nextProps.selected
      });
  }
});  

module.exports = ContainerComponent 
