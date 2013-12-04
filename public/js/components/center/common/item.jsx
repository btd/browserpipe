/**
 * @jsx React.DOM
 */

var _state = require('../../../state'),
    page = require('page'),
    extension = require('../../../extension/extension'),
    _ = require('lodash'),
    React = require('react'),
    PanelActivatorMixin = require('../../util/panel.activator.mixin'),
    selection = require('../../../selection/selection');

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
          selection.isItemSelected(this.props.item._id);
  },
  urlClicked: function(e) {  
    if(this.props.isTab) {
      e.preventDefault();
      extension.focusTab(this.props.item.externalId);
    }    
  },
  handleItemClick: function(e){
    e.preventDefault(); 
    e.stopPropagation();
    var elementId = e.target.id;
    if(!elementId)
        elementId = $(e.target).parents('.item:first').attr('id');
    var itemId = elementId.substring(3);
    this.props.navigateToItem(itemId);
  },
  handleItemRemoveClick: function(e){
    e.preventDefault();
    e.stopPropagation();
    this.props.removeItem(this.props.item);
  },
  getItemId : function() {
    return "it-" + this.props.item._id;
  },
  getItemClass: function() {
    return "item " + 
        (this.isSelected()? selection.getClassName() : '');
  },  
  getRemoveIcon: function() {
    if(this.props.removeItem)
      return <i className="icon-remove remove-item" onClick={ this.handlePanelClick(this.handleItemRemoveClick) } title="Close"></i>
    else
      return null;
  },
  render: function() {
    return (          
      <li ref='item' 
          id={ this.getItemId() } 
          ref="item"  
          onClick={ this.handlePanelClick(this.handleItemClick) } 
          className={ this.getItemClass() }
          /*draggable="true"
          onDragStart={this.props.itemDraggable.objDragStart} 
          onDragEnd={this.props.itemDraggable.objDragEnd}
          onDragOver={this.props.itemDraggable.objDragOver}
          onDragEnter={this.props.itemDraggable.objDragEnter}
          onDragLeave={this.props.itemDraggable.objDragLeave}
          onDrop={this.props.itemDraggable.objDrop}*/
        > 
        { this.getRemoveIcon() }
        <img draggable="false" className="favicon" src={ this.props.item.favicon } alt="Favicon" />
        <a draggable="false"  onClick={ this.handlePanelClick(this.urlClicked) } className="title" target="_blank" href={this.props.item.url}>
          {  this.getTitle()  } 
        </a>
        <div className="description">{ this.props.item.note }</div>  		
        /*<div className="screenshot-container">
          <img className="screenshot" src={ this.getScreenshot() } alt="ScreenShot" />
        </div>  */        
      </li>
    );    
  }
});

module.exports = ItemComponent
