/**
 * @jsx React.DOM
 */

var _state = require('../../../state'),
    page = require('page'),
    extension = require('../../../extension/extension'),
    _ = require('lodash'),
    React = require('react'),
    PanelActivatorMixin = require('../../util/panel.activator.mixin');    

var ItemComponent = React.createClass({ 
  mixins: [PanelActivatorMixin],  
  getTitle: function() {
    if(this.props.item.title)
      return this.props.item.title.trim();
    else
      return this.props.item.url;
  }, 
  getScreenshot: function() {
    return this.props.item.screenshot || "/img/no_screenshot.png";
  },
  isSelected: function() {
    return this.props.forceSelected || 
          this.props.selection.isItemSelected(this.props.item._id);
  },
  urlClicked: function(e) {  
    if(this.props.isTab) {      
      e.preventDefault(); 
      e.stopPropagation();
      console.log('yesssss')
      extension.focusTab(this.props.item.externalId);
    }    
    else {
      e.stopPropagation();
      return true;
    }      
  },
  getElementId: function(e) {
    var elementId = e.target.id;    
    if(!elementId)
        elementId = $(e.target).parents('.item:first').attr('id');
    return elementId.substring(3);
  },
  handleItemClick: function(e){
    e.preventDefault(); 
    e.stopPropagation();
    var itemId = this.getElementId(e);
    this.props.navigateToItem(itemId);
  },
  handleItemRemoveClick: function(e){
    e.preventDefault();
    e.stopPropagation();
    this.props.removeItem(this.props.item);
  },
  handleSelectCheckboxClick: function(e) {
    e.stopPropagation();
    var itemId = this.getElementId(e);
    if(!this.isSelected())
      this.props.selection.selectItem(this.props.item._id);
    else
      this.props.selection.unSelectItem(this.props.item._id);
  },
  getItemId : function() {
    return "it-" + this.props.item._id;
  },
  getItemClass: function() {
    return "item " + 
        (this.isSelected()? this.props.selection.getClassName() : '');
  },  
  getRemoveIcon: function() {
    if(this.props.removeItem)
      return <i className="icon-remove remove-item" onClick={ this.handlePanelClick(this.handleItemRemoveClick) } title="Close"></i>
    else
      return null;
  },
  render: function() {
    return (          
      <li id={ this.getItemId() }           
          onClick={ this.handlePanelClick(this.handleItemClick) } 
          className={ this.getItemClass() }
        > 
        <input ref="checkbox" className="checked" type='checkbox' onClick= {this.handlePanelClick(this.handleSelectCheckboxClick) } />
        { this.getRemoveIcon() }
        <img draggable="false" className="favicon" src={ this.props.item.favicon } alt="Favicon" />
        <a draggable="false"  onClick={ this.urlClicked } className="title" target="_blank" href={this.props.item.url}>
          {  this.getTitle()  } 
        </a>
        <div className="description">{ this.props.item.note }</div>  		
        /*<div className="screenshot-container">
          <img className="screenshot" src={ this.getScreenshot() } alt="ScreenShot" />
        </div>  */        
      </li>
    );    
  },
  updateCheckbox: function() {
    if(this.isSelected())
      this.refs.checkbox.getDOMNode().checked = true;
    else
      this.refs.checkbox.getDOMNode().checked = false;
  },
  componentDidMount: function(){ 
    this.updateCheckbox();     
  },
  componentDidUpdate: function(){ 
    this.updateCheckbox();     
  }
});

module.exports = ItemComponent
