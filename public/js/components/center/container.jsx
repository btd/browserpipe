/**
 * @jsx React.DOM
 */

var _state = require('../../state'),
    _ = require('lodash'),
    page = require('page'),
    React = require('react'),
    Item = require('./item'),    
    LabelEditorComponent = require('../util/label.editor'),
    /*containerDraggable = require('../../dragging/container'),*/
    selection = require('../../selection/selection');

var ContainerComponent = React.createClass({ 
  getContainerHeight: function() {
    return this.props.height - 136; //(36 = listboard subbar height)
  },
  /*getContainerWidth: function() {    
    return this.props.width; 
  },*/
  saveContainerTitle: function(newTitle, success) {    
    _state.serverUpdateContainer({
      _id: this.props.selectedContainer._id,
      title: newTitle
    }, success );
  },
  addEmptyContainer: function() {      
      _state.serverSaveContainer(this.props.selectedContainer._id, {
          type: 1
      })
  },
  goToSettings: function(e) {
    page('/listboard/' + this.props.selectedContainer._id + '/settings');
    e.preventDefault();
  },
  /*getContainerStyle: function() {
      var visible = this.props.visible? "block" : "none";
      return { width: this.getContainerWidth(), display: visible };
  },*/
  getNavInnerClass: function(listboard) {
      return 'navbar-inner ' +      
      (this.props.selectedContainer.type === 0 ? 'browser' : 'custom')
  },
  render: function() {
    var self = this;  
    //var containersHeight = this.getContainerHeight();        
    //var forceSelected = selection.isContainerSelected(this.props.selectedContainer._id);
    return (               
        <div className="listboard" /*style={this.getContainerStyle()}*/ >
          <div className="navbar sub-bar">
            <div className={ this.getNavInnerClass() }>
              <ul className="nav">                                  
                <li>                  
                  <LabelEditorComponent 
                    onSaveLabel= {this.saveContainerTitle} 
                    labelValue= {this.props.selectedContainer.title} 
                    defaultLabelValue= "Unnamed" />
                  <span className="last-sync-time">(last sync 2 min ago)</span>
                </li>                                  
              </ul>              
              <ul className="nav pull-right">              
                <li>
                  <a draggable="false"  className="add-container btn" onClick={this.addEmptyContainer} href="#" title="Add empty container" data-toggle="tooltip">
                    <i className="icon-plus"></i>
                  </a>
                </li>                
                <li className="divider"></li>
                <li>
                  <a draggable="false"  className="btn" onClick={this.goToSettings} href="#" title="Settings" data-toggle="tooltip">
                    <i className="icon-cog"></i>
                  </a>
                </li>
              </ul>                
            </div>
          </div>          
          <div className="listboard-center" style= {{ height: this.getContainerHeight() }} >
            <ul className="items"
              /*onDragOver={itemDraggable.parentDragOver}
                      onEnter={itemDraggable.parentDragEnter}
                      onDragLeave={itemDraggable.parentDragLeave}
                      onDrop={itemDraggable.parentDrop}*/
            >
            {                    
                  _.flatten(
                    this.props.selectedContainer.containers.map(function(container) { 
                      return container.items.map(function(item) {
                          return <Item 
                        item= {item} 
                        /*isTab= {isTab}
                        itemDraggable={itemDraggable} 
                        forceSelected={forceSelected}*/ />
                      })
                    })
                  )
            }
            </ul>
          </div>
        </div>
    );
  }
});

module.exports = ContainerComponent