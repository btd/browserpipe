/**
 * @jsx React.DOM
 */

var _state = require('../../state'),
    page = require('page'),
    extension = require('../../extension/extension'),
    _ = require('lodash'),
    React = require('react'),
    selection = require('../../selection/selection');

var ItemComponent = React.createClass({   
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
  navigateToItem: function(e) {
    e.preventDefault();
    e.stopPropagation();
    if(e.ctrlKey){
        if(!this.isSelected())
          selection.selectItem(this.props.item._id);
        else
          selection.unSelectItem(this.props.item._id);
    }
    else    
      page('/item/' + this.props.item._id);
  },
  urlClicked: function(e) {
    e.stopPropagation();      
    if(this.props.isTab) {
      e.preventDefault();
      extension.focusTab(this.props.item.externalId);
    }    
  },
  getItemId : function() {
    return "it-" + this.props.item._id;
  },
  getItemClass: function() {
    return "item " + 
        (this.isSelected()? selection.getClassName() : '');
  },  
  render: function() {
    return (          
      <li ref='item' 
          id={ this.getItemId() } 
          ref="item"  
          onClick={ this.navigateToItem } 
          className={ this.getItemClass() }
          draggable="true"
          onDragStart={this.props.itemDraggable.objDragStart} 
          onDragEnd={this.props.itemDraggable.objDragEnd}
          onDragOver={this.props.itemDraggable.objDragOver}
          onDragEnter={this.props.itemDraggable.objDragEnter}
          onDragLeave={this.props.itemDraggable.objDragLeave}
          onDrop={this.props.itemDraggable.objDrop}
        > 
        <i className="icon-remove remove-item" title="Close"></i>
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
  }
});

module.exports = ItemComponent
